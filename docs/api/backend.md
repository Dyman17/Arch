# ⚙️ API-контракт — Backend (фиксированный)

> 🔒 **ЗАМОРОЖЕНО.** Менять этот файл может только техлид (@Dyman17). Фронт подключается отдельно строго по этим эндпоинтам. Изменение 24.09: `POST /dialog/turn` (мозг), `POST /event`, админские, языки kk/ru/en+any.

**Base URL:** `/api` · **Формат:** JSON, UTF-8 · **Языки:** основные `kk` | `ru` | `en` (default `kk`), любой другой через LLM

## 0. Общее

### Формат успеха

Прямой JSON объекта (без обёрток).

### Формат ошибки

```json
{ "error": { "code": "PLACE_NOT_FOUND", "message": "Место не найдено", "lang": "ru", "details": {} } }
```

| HTTP | code | Когда |
|------|------|-------|
| 400 | `BAD_REQUEST` | невалидное тело/параметры, неизвестный тип события |
| 404 | `PLACE_NOT_FOUND` | нет места / сцены |
| 422 | `SPEECH_UNRECOGNIZED` | STT/intent не сработал; `details.stage`: `stt` / `intent` |
| 429 | `RATE_LIMITED` | >10 voice/мин на `session_id` |
| 500 | `INTERNAL` | внутренняя ошибка |
| 503 | `ROUTE_UNAVAILABLE` | сервис маршрутов недоступен |
| 503 | `AI_UNAVAILABLE` | STT/LLM недоступен |

### Порядок реализации бэка

```
B1 модели+seed → B2 config/places/route → B3 voice→dialog/turn → B4 scene/qr →
B9 stats → B10 feedback → B7/B8 LLM-ключ → B11 TTS → B12 память
Каждый шаг: сначала 200 на seed, потом логика.
```

---

## Флоу 01. Витрина

### `GET /api/config` → 200

```json
{
  "screen_id": "aktau-naberezhnaya-1",
  "origin": { "lat": 43.6420, "lng": 51.1720, "heading_deg": 90 },
  "languages": ["kk", "ru", "en"],
  "default_lang": "kk",
  "modes": { "voice": true, "tarihsky": true, "qr": true, "huskylens": false },
  "session": { "idle_timeout_sec": 90, "qr_timeout_sec": 60 },
  "district": "aktau-centr",
  "categories": ["park", "mall", "market", "history", "nature", "religion"]
}
```

### `GET /api/places` → 200

Query: `lang` (def `ru`), `limit` (def 50), `q` (поиск по имени/описанию, выполняет бэк), `categories` (`"nature,religion"`, OR), `bbox` (опц.).

```json
{
  "places": [
    {
      "id": 1, "name": "Набережная Актау", "summary": "…",
      "category": "park", "lat": 43.6420, "lng": 51.1720,
      "thumb_url": "/static/places/1.jpg",
      "has_scene": true,
      "hours": null,
      "access": "walk"
    }
  ],
  "total": 12,
  "lang": "ru"
}
```

`total` — после фильтров, до `limit`. `hours: null` = открыто всегда. `access`: `walk` | `transit`.

---

## Флоу 02. Показ места

### `GET /api/places/{id}?lang=` → 200 | 404 `PLACE_NOT_FOUND`

```json
{
  "id": 1, "name": "…", "summary": "…", "description": "…",
  "category": "park", "lat": 43.6420, "lng": 51.1720, "address": "Актау",
  "photos": ["/static/places/1a.jpg"],
  "hours": null, "is_open_now": true, "opens_next": null,
  "has_scene": true, "access": "walk",
  "langs": ["kk", "ru", "en"]
}
```

### `GET /api/places/{id}/route?mode=walk&fallback=0` → 200 | 404 | 503 `ROUTE_UNAVAILABLE`

Маршрут **от `config.origin`**. `mode`: `walk` (def) | `transit`.

```json
{
  "place_id": 1, "mode": "walk",
  "distance_m": 850, "duration_min": 11,
  "bearing_deg": 42,
  "direction_text": "идите на северо-восток",
  "is_approximate": false,
  "geometry": { "type": "LineString", "coordinates": [[51.172, 43.642], [51.1922, 43.6551]] },
  "steps": [{ "instruction": "Прямо по набережной 400 м", "distance_m": 400 }]
}
```

- `bearing_deg` считает **только бэк** (азимут от стелы, 0–360)
- `transit`/`access=transit`: `steps` включают точку посадки
- `?fallback=1` → 200, прямая линия, `is_approximate: true`

---

## Флоу 03. QR

### `POST /api/qr` → 200 | 404

Request: `{ "place_id": 1, "lang": "ru", "session_id": "uuid" }`

```json
{ "url": "https://m.example/r/abc123", "payload_version": 1, "expires_in_sec": 3600 }
```

Токен пишется в `qr_tokens` (TTL 3600). Событие `qr_scan` пишет бэк.

---

## Флоу 04. Диалог (мозг)

### `POST /api/dialog/turn` → 200 | 422 | 429 | 503

Единственный вход диалога. Память — на сервере по `session_id`.

Request:

```json
{
  "session_id": "uuid",
  "lang": "auto",
  "audio_b64": "base64-аудио (опц.)",
  "mime": "audio/wav",
  "text": "опционально (распознано клиентом / транскрибация жестов)",
  "signs": [ { "hand": "right", "landmarks": [[x, y, z], "...21 точка..."] } ],
  "context": { "screen": "listening", "last_place_id": null }
}
```

- `lang`: `"auto"` | `"kk"` | `"ru"` | `"en"` | любой (zh, pt-BR…) — через LLM
- Лимит аудио: 15 с. `signs` — MediaPipe Hands, позже (поле зарезервировано)

Response (место найдено):

```json
{
  "lang": "zh",
  "say": "׳ɯմմ… (1–2 предложения на языке туриста)",
  "intent": "route_to_place",
  "place_id": 1,
  "actions": [{ "show": "route", "place_id": 1 }],
  "suggestions": [],
  "memory_patch": { "places": [1] },
  "debug": { "stt_text": "…", "via": "llm" }
}
```

Response (несколько вариантов):

```json
{
  "lang": "ru", "say": "Нашёл несколько мест рядом.",
  "intent": "search", "place_id": null,
  "actions": [],
  "suggestions": [{ "id": 1, "name": "Музей моря" }],
  "memory_patch": {},
  "debug": { "stt_text": "…", "via": "rules" }
}
```

Response (история):

```json
{
  "lang": "ru", "say": "…", "intent": "scene_info", "place_id": 1,
  "actions": [{ "show": "scene", "place_id": 1 }],
  "suggestions": [], "memory_patch": {},
  "debug": { "via": "llm" }
}
```

`actions[].show`: `map` | `route` | `scene` | `qr` | `sleep`. Фронт исполняет по порядку, ничего не решает.

Совместимость: старый `POST /api/voice` остаётся рабочим алиасом (тот же ответ + `need_route/need_scene`).

---

## Флоу 05. TarihSky

### `GET /api/places/{id}/scene` → 200 | 404 `PLACE_NOT_FOUND`

```json
{
  "place_id": 1, "enabled": true,
  "modern_url": "/static/scenes/1/modern.jpg",
  "historic_url": "/static/scenes/1/historic.jpg",
  "attribution": "художественная реконструкция",
  "texts": {
    "kk": { "title": "…", "body": "…" },
    "ru": { "title": "Тогда и сейчас", "body": "…" },
    "en": { "title": "Then and Now", "body": "…" }
  },
  "sources": ["…"]
}
```

404 → фронт ничего не показывает, диалог говорит «истории пока нет».

---

## Флоу 06. Сеанс, события, здоровье

### `POST /api/event` → 200 | 400 `BAD_REQUEST`

Request: `{ "session_id": "uuid", "type": "place_view|route_click|scene_open|qr_scan|voice_query|session_start", "place_id": null, "lang": "ru" }`

Response: `{ "ok": true }`

### `POST /api/session/end` → 200

Request: `{ "session_id": "uuid" }` → `{ "ok": true }`. Память сеанса стирается.

### `GET /api/health` → 200

```json
{ "status": "ok", "db": true, "route_provider": true, "ai": false, "version": "0.1.0" }
```

---

## Админ (B2G дашборд)

### `GET /api/admin/metrics` → 200

```json
{
  "sessions": 42, "unique_langs": 3,
  "by_lang": { "ru": 30, "kk": 8, "zh": 4 },
  "top_places": [{ "place_id": 1, "name": "…", "requests": 15 }],
  "by_hour": { "10": 5, "11": 12 }
}
```

### `GET /api/admin/heatmap` → 200

```json
[{ "lat": 43.642, "lng": 51.172, "weight": 15 }]
```

### `GET /api/admin/places/stats` → 200

```json
[{ "place_id": 1, "name": "…", "requests": 15, "route_clicks": 9, "scene_opens": 4, "dead": false }]
```

---

## B11. TTS (на утверждении, не реализовывать до PR)

```
POST /api/tts
← { "text": "…", "lang": "zh" }
→ { "audio_url": "/static/tts/abc.mp3", "expires_in_sec": 3600 }
```

---

## Seed (минимум)

12 мест (Акту/Мангистау, координаты сверены) + 3 сцены-заглушки. Обязательные поля — см. `places`/`scene` выше.

## Env (только сервер, не в репо)

```
DATABASE_URL=postgresql+psycopg://…  (черновик: sqlite-файл)
LLM_PROVIDER=gemini|openai|none
GEMINI_API_KEY=… | OPENAI_API_KEY=… / OPENAI_BASE_URL / LLM_MODEL=gpt-4o-mini
```

---

_Фронт: [frontend.md](frontend.md). Флоу: [../flows/](../flows/README.md)._
