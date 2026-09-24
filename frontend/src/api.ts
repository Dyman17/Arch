import type {
  KioskConfig,
  Place,
  RouteResponse,
  SceneResponse,
  QrResponse,
  DialogTurnRequest,
  DialogTurnResponse,
} from './types';
import {
  mockKioskConfig,
  rawPlacesSeed,
  mockScenes,
  generateMockRoute,
} from './mocks/seedData';

const BASE_URL = '/api';

function localizePlace(raw: any, lang: string): Place {
  const currentLang = ['kk', 'ru', 'en'].includes(lang) ? lang : 'ru';
  const textObj = raw.texts?.[currentLang] || raw.texts?.ru || raw.texts?.kk || raw.texts?.en || {};
  return {
    id: raw.id,
    name: textObj.name || raw.name || `Место #${raw.id}`,
    summary: textObj.summary || raw.summary || '',
    description: textObj.description || raw.description || '',
    address: textObj.address || raw.address || 'Ақтау',
    category: raw.category || 'culture',
    lat: raw.lat,
    lng: raw.lng,
    thumb_url: raw.thumb_url || '/static/places/placeholder.svg',
    photos: raw.photos || [raw.thumb_url],
    hours: raw.hours || null,
    is_open_now: true,
    opens_next: null,
    has_scene: Boolean(raw.has_scene || mockScenes[raw.id]),
    access: raw.access || 'walk',
    texts: raw.texts,
    curatedBadge: raw.curatedBadge,
    heroTag: raw.heroTag,
    rating: raw.rating,
  };
}

export async function fetchConfig(): Promise<KioskConfig> {
  try {
    const res = await fetch(`${BASE_URL}/config`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] /api/config unavailable, using mock config');
  }
  return mockKioskConfig;
}

export async function fetchPlaces(lang: string = 'ru', category?: string): Promise<{ places: Place[]; total: number; lang: string }> {
  try {
    const url = new URL(`${window.location.origin}${BASE_URL}/places`);
    url.searchParams.set('lang', lang);
    if (category) url.searchParams.set('categories', category);
    const res = await fetch(url.toString());
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('[API] /api/places unavailable, using mock places');
  }

  let places = rawPlacesSeed.map((p) => localizePlace(p, lang));
  if (category && category !== 'all') {
    places = places.filter((p) => p.category === category);
  }
  return {
    places,
    total: places.length,
    lang,
  };
}

export async function fetchPlaceById(id: number, lang: string = 'ru'): Promise<Place> {
  try {
    const res = await fetch(`${BASE_URL}/places/${id}?lang=${lang}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`[API] /api/places/${id} unavailable, using mock place`);
  }

  const raw = rawPlacesSeed.find((p) => p.id === id);
  if (!raw) {
    throw new Error('PLACE_NOT_FOUND');
  }
  return localizePlace(raw, lang);
}

export async function fetchRoute(placeId: number, lang: string = 'ru'): Promise<RouteResponse> {
  try {
    const res = await fetch(`${BASE_URL}/places/${placeId}/route?mode=walk&fallback=1`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`[API] /api/places/${placeId}/route unavailable, calculating route`);
  }

  const raw = rawPlacesSeed.find((p) => p.id === placeId);
  if (!raw) throw new Error('PLACE_NOT_FOUND');
  const place = localizePlace(raw, lang);
  return generateMockRoute(mockKioskConfig.origin, place, lang);
}

export async function fetchScene(placeId: number): Promise<SceneResponse | null> {
  try {
    const res = await fetch(`${BASE_URL}/places/${placeId}/scene`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`[API] /api/places/${placeId}/scene unavailable, checking mock scenes`);
  }

  return mockScenes[placeId] || null;
}

export async function fetchQr(placeId: number, lang: string, sessionId: string): Promise<QrResponse> {
  try {
    const res = await fetch(`${BASE_URL}/qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ place_id: placeId, lang, session_id: sessionId }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] /api/qr unavailable, generating mock QR');
  }

  const raw = rawPlacesSeed.find((p) => p.id === placeId);
  const lat = raw ? raw.lat : 43.661365;
  const lng = raw ? raw.lng : 51.132965;
  return {
    url: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    payload_version: 1,
    expires_in_sec: 3600,
  };
}

export async function sendDialogTurn(req: DialogTurnRequest): Promise<DialogTurnResponse> {
  try {
    const res = await fetch(`${BASE_URL}/dialog/turn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] /api/dialog/turn unavailable, resolving with local intelligence');
  }

  const query = (req.text || '').toLowerCase().trim();
  const lang = req.lang === 'auto' ? detectLanguage(query) : req.lang;

  // 1. Goodbye / Session End
  if (/рахмет|сау бол|пока|до свидания|спасибо|всё|goodbye|bye|thank/i.test(query)) {
    const farewell =
      lang === 'kk'
        ? 'Көріскенше! Ақтау мен Маңғыстау бойынша саяхатыңыз сәтті өтсін.'
        : lang === 'en'
        ? 'Farewell! May your Caspian and Mangystau adventure be unforgettable.'
        : 'До свидания! Незабываемых впечатлений от побережья Каспия.';
    return {
      lang,
      say: farewell,
      intent: 'session_end',
      actions: [{ show: 'sleep' }],
      suggestions: [],
    };
  }

  // 2. TarihSky command
  if (/тарих|өткен|раньше|истори|history|then and now|было/i.test(query)) {
    const targetId = req.context?.last_place_id || 1;
    const say =
      lang === 'kk'
        ? 'TarihSky мұрағаттық режимін қосамын. Өткен шақ пен бүгінгі көріністі салыстырыңыз.'
        : lang === 'en'
        ? 'Opening TarihSky heritage archive. Explore the transformation of this landmark over time.'
        : 'Открываю TarihSky. Посмотрите, как этот берег выглядел в советские шестидесятые.';
    return {
      lang,
      say,
      intent: 'scene_info',
      place_id: targetId,
      actions: [{ show: 'scene', place_id: targetId }],
      suggestions: [],
    };
  }

  // 3. QR / Mobile send command
  if (/телефон|qr|смартфон|жөнелт|отправь|скачать|phone|mobile/i.test(query)) {
    const targetId = req.context?.last_place_id || 1;
    const say =
      lang === 'kk'
        ? 'Маршрутты смартфонға көшіру үшін экрандағы QR-кодты сканерлеңіз.'
        : lang === 'en'
        ? 'Scan the interactive QR code with your mobile camera to take the navigation route.'
        : 'Отсканируйте QR-код на экране, чтобы перенести интерактивный маршрут в ваш телефон.';
    return {
      lang,
      say,
      intent: 'qr_export',
      place_id: targetId,
      actions: [{ show: 'qr', place_id: targetId }],
      suggestions: [],
    };
  }

  // 4. "What is near" / "Что рядом"
  if (/жақын|қасында|рядом|поблизости|что рядом|nearby|near/i.test(query)) {
    const say =
      lang === 'kk'
        ? 'Стелла маңында: Амфитеатр, 15-шағынаудан жағалауы және Каспий панорамалық көрініс алаңы бар.'
        : lang === 'en'
        ? 'Around this kiosk: Waterfront Amphitheater, 15th Microdistrict Promenade, and Caspian Viewpoint.'
        : 'Поблизости расположены: городской Амфитеатр, набережная 15-го микрорайона и смотровая терраса.';
    return {
      lang,
      say,
      intent: 'search_nearby',
      place_id: 1,
      actions: [{ show: 'route', place_id: 1 }],
      suggestions: [
        { id: 1, name: 'Амфитеатр' },
        { id: 2, name: 'Набережная 15-го мкр' },
        { id: 3, name: 'Смотровая площадка' },
      ],
    };
  }

  // 5. Place search by keyword
  const localizedSeed = rawPlacesSeed.map((p) => localizePlace(p, lang));
  const matchedPlace = localizedSeed.find((p) => {
    const n = p.name.toLowerCase();
    const s = p.summary.toLowerCase();
    const d = (p.description || '').toLowerCase();
    return (
      (query.length >= 3 && (n.includes(query) || s.includes(query) || d.includes(query))) ||
      (query.includes('амфитеатр') && p.id === 1) ||
      (query.includes('набережн') && p.id === 2) ||
      (query.includes('жағалау') && p.id === 2) ||
      (query.includes('смотров') && p.id === 3) ||
      (query.includes('көрініс') && p.id === 3) ||
      (query.includes('құдық') && p.id === 4) ||
      (query.includes('колод') && p.id === 4) ||
      (query.includes('түйе') && p.id === 5) ||
      (query.includes('хан') && p.id === 5) ||
      (query.includes('кобра') && p.id === 6) ||
      (query.includes('қасқыр') && p.id === 7) ||
      (query.includes('волк') && p.id === 7) ||
      (query.includes('ту') && p.id === 8) ||
      (query.includes('флаг') && p.id === 8) ||
      (query.includes('бала') && p.id === 9) ||
      (query.includes('детск') && p.id === 9) ||
      (query.includes('демал') && p.id === 10) ||
      (query.includes('отдых') && p.id === 10)
    );
  });

  if (matchedPlace) {
    const route = generateMockRoute(mockKioskConfig.origin, matchedPlace, lang);
    const say =
      lang === 'kk'
        ? `Табылды: «${matchedPlace.name}». Қашықтығы ${route.distance_m} м, жаяу шамамен ${route.duration_min} минут. Бағытыңыз: ${route.direction_text}.`
        : lang === 'en'
        ? `Found: "${matchedPlace.name}". Distance: ${route.distance_m} m, approx. ${route.duration_min} min walk. Direction: ${route.direction_text}.`
        : `Найдено: «${matchedPlace.name}». Расстояние ${route.distance_m} м, примерно ${route.duration_min} мин пешком. ${route.direction_text}.`;
    return {
      lang,
      say,
      intent: 'route_to_place',
      place_id: matchedPlace.id,
      actions: [{ show: 'route', place_id: matchedPlace.id }],
      suggestions: [{ id: matchedPlace.id, name: matchedPlace.name }],
      memory_patch: { places: [matchedPlace.id] },
      debug: { stt_text: req.text, via: 'local_nlp_engine' },
    };
  }

  // 6. Default Fallback
  const fallbackSay =
    lang === 'kk'
      ? 'Сіздің дауысыңызды анық естідім. «Амфитеатр қайда?», «Не көруге болады?», немесе «Тарихты көрсет» деп көріңіз.'
      : lang === 'en'
      ? 'I hear you clearly. You may ask: "Where is the Amphitheater?", "What is nearby?", or "Show history".'
      : 'Я вас слушаю. Вы можете спросить: «Как пройти к Амфитеатру?», «Что посмотреть рядом?» или «Покажи историю».';

  return {
    lang,
    say: fallbackSay,
    intent: 'search',
    place_id: null,
    actions: [{ show: 'map' }],
    suggestions: [
      { id: 1, name: 'Амфитеатр' },
      { id: 2, name: 'Набережная' },
      { id: 3, name: 'Смотровая площадка' },
    ],
    debug: { stt_text: req.text, via: 'fallback_prompt' },
  };
}

function detectLanguage(text: string): 'kk' | 'ru' | 'en' {
  if (/[әіңғүұқөһ]/i.test(text) || /қайда|қалай|бар|жоқ|көрсет/i.test(text)) return 'kk';
  if (/[a-zA-Z]/.test(text) && !/[а-яА-ЯёЁ]/.test(text)) return 'en';
  return 'ru';
}

export async function endSession(sessionId: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/session/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    });
    return res.ok;
  } catch {
    return true;
  }
}
