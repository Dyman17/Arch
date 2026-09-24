# ⚙️ API-контракт — Backend

> 🔒 **ЗАМОРОЖЕНО.** Менять этот файл может только техлид (@Dyman17). Изменение 24.09: по приказу техлида добавлены `q`/`categories` в `GET places` и `categories` в `config`.

Что реализует бэк (@RKydyrali). Фронт читает [frontend.md](frontend.md), общий процесс — в [README.md](README.md).

**Base URL:** `/api` · **JSON, UTF-8** · **Языки:** `ru` | `en` | `kk`

---

## 0. Общее

### Единый формат ошибки

```json
{ "error": { "code": "PLACE_NOT_FOUND", "message": "Место не найдено", "details": {} } }
```

| HTTP | code | Когда |
|------|------|-------|
| 400 | `BAD_REQUEST` | Невалидное тело/параметры |
| 404 | `PLACE_NOT_FOUND` | Нет места / сцены |
| 422 | `SPEECH_UNRECOGNIZED` | STT/intent не сработал, `details.stage`: `stt` / `intent` |
| 429 | `RATE_LIMITED` | Слишком часто |
| 500 | `INTERNAL` | Внутренняя ошибка |
| 503 | `ROUTE_UNAVAILABLE` | Сервис маршрутов недоступен |
| 503 | `AI_UNAVAILABLE` | STT/LLM недоступен |

### Порядок реализации

```
1. Модели + seed → 2. config/places/route → 3. voice → 4. scene/qr → 5. health
Каждый шаг: сначала 200 на seed, потом логика.
```

---

## Флоу 1. Карта + каталог

### `GET /api/config`

```json
{
  "screen_id": "aktau-naberezhnaya-1",
  "origin": { "lat": 43.6420, "lng": 51.1720, "heading_deg": 90 },
  "languages": ["ru", "en", "kk"],
  "default_lang": "ru",
  "modes": { "voice": true, "tarihsky": true, "qr": true, "huskylens": false },
  "session": { "idle_timeout_sec": 90, "qr_timeout_sec": 30 },
  "district": "aktau-centr",
  "categories": ["park", "mall", "market", "history", "nature", "religion"]
}
```

### `GET /api/places`

Query: `lang=ru`, `bbox=` (опц.), `limit=50`, **`q=` (поиск по имени/описанию, выполняет бэк)**, **`categories=` («nature,religion» — мультифильтр, OR)**

`total` — число после фильтров (до `limit`).

```json
{
  "places": [
    {
      "id": 1,
      "name": "Музей моря",
      "summary": "Короткое описание",
      "category": "museum",
      "lat": 43.6551,
      "lng": 51.1922,
      "thumb_url": "/static/places/1.jpg",
      "has_scene": true,
      "hours": { "open": "10:00", "close": "18:00", "days": [1,2,3,4,5,6], "tz": "Asia/Almaty" },
      "access": "walk"
    }
  ],
  "total": 12,
  "lang": "ru"
}
```

`access`: `"walk"` | `"transit"`.

---

## Флоу 2. Карточка места + маршрут

### `GET /api/places/{id}`

**`hours: null` = уличные места (открыто всегда).** `opens_next: null` при `hours: null`.

```json
{
  "id": 1,
  "name": "Музей моря",
  "summary": "…",
  "description": "Развёрнутый текст",
  "category": "museum",
  "lat": 43.6551,
  "lng": 51.1922,
  "address": "ул. …, Актау",
  "photos": ["/static/places/1a.jpg"],
  "hours": { "open": "10:00", "close": "18:00", "days": [1,2,3,4,5,6], "tz": "Asia/Almaty" },
  "is_open_now": true,
  "opens_next": "10:00",
  "has_scene": true,
  "access": "walk",
  "langs": ["ru", "en", "kk"]
}
```

**404:** `PLACE_NOT_FOUND`

### `GET /api/places/{id}/route`

Маршрут **от точки стелы** (`config.origin`). Query: `mode=walk` (default) | `transit`

```json
{
  "place_id": 1,
  "mode": "walk",
  "distance_m": 850,
  "duration_min": 11,
  "bearing_deg": 42,
  "direction_text": "идите на северо-восток",
  "is_approximate": false,
  "geometry": { "type": "LineString", "coordinates": [[51.19, 43.65], [51.1922, 43.6551]] },
  "steps": [
    { "instruction": "Прямо по набережной 400 м", "distance_m": 400 },
    { "instruction": "Повернуть направо", "distance_m": 450 }
  ]
}
```

- `bearing_deg` — азимут от стелы (0–360). Считает бэк
- `mode=transit` / `access=transit` — `steps` включают точку посадки
- Фоллбэк: `GET .../route?fallback=1` → 200, прямая линия, `is_approximate: true`
- **503:** `ROUTE_UNAVAILABLE`

---

## Флоу 3. QR

### `POST /api/qr`

Request: `{ "place_id": 1, "lang": "ru", "session_id": "uuid" }`

```json
{ "url": "https://m.example/r/abc123", "payload_version": 1, "expires_in_sec": 3600 }
```

Страница по `url` — маршрут места на телефоне.

---

## Флоу 4. Голос

### `POST /api/voice`

Request:
```json
{
  "session_id": "uuid-сеанса",
  "lang": "auto",
  "mode": "nav",
  "audio_b64": "base64-аудио",
  "mime": "audio/wav",
  "text": "опционально, если распознано на клиенте",
  "context": { "screen": "recording", "last_place_id": null }
}
```

- `lang`: `"auto"` | `"ru"` | `"en"` | `"kk"`; `mode`: `"nav"` | `"scene"`; лимит аудио 15 с

Место найдено:
```json
{
  "lang": "en",
  "intent": "route_to_place",
  "place_id": 1,
  "answer": "The Sea Museum is an 11-minute walk from here.",
  "need_route": true,
  "need_scene": false,
  "suggestions": [],
  "debug": { "stt_text": "how to get to the sea museum" }
}
```

Точного места нет:
```json
{
  "lang": "en",
  "intent": "search",
  "place_id": null,
  "answer": "I found several places nearby.",
  "need_route": false,
  "need_scene": false,
  "suggestions": [{ "id": 1, "name": "Музей моря" }],
  "debug": { "stt_text": "museums" }
}
```

Вопрос по сцене:
```json
{
  "lang": "en",
  "intent": "scene_info",
  "place_id": 1,
  "answer": "This building was constructed in 1972…",
  "need_route": false,
  "need_scene": true,
  "suggestions": []
}
```

**422:** `SPEECH_UNRECOGNIZED` · **503:** `AI_UNAVAILABLE`

---

## Флоу 5. TarihSky

### `GET /api/places/{id}/scene`

```json
{
  "place_id": 1,
  "enabled": true,
  "modern_url": "/static/scenes/1/modern.jpg",
  "historic_url": "/static/scenes/1/historic.jpg",
  "attribution": "художественная реконструкция",
  "texts": {
    "ru": { "title": "Тогда и сейчас", "body": "Справка…" },
    "en": { "title": "Then and Now", "body": "…" },
    "kk": { "title": "Бұрын және қазір", "body": "…" }
  },
  "sources": ["…"]
}
```

**404:** `PLACE_NOT_FOUND`

---

## Флоу 6. Сеанс и здоровье

### `POST /api/session/end`

`{ "session_id": "uuid" }` → 200 `{ "ok": true }`

### `GET /api/health`

```json
{ "status": "ok", "db": true, "route_provider": true, "ai": true, "version": "0.1.0" }
```

---

## Seed-данные

10–20 мест одного района Актау. Обязательно: id, name, lat, lng, summary/description по языкам, hours (или null), access walk/transit. Для 2–3 мест: scene (2 изображения + texts + sources).

## Env и ключи

Routing, STT, LLM — ключи **только на сервере** (`.env`, не в репозитории). Выбор провайдеров — техлид.

## Чеклист бэка

- [ ] Все эндпоинты отдают 200 на seed
- [ ] Ошибки — только форматом из раздела 0
- [ ] `route` считает `bearing_deg` от `config.origin`
- [ ] Ключей в коде/репо нет
