# 🛠 Технологический стек — BaGdar

Отдельный док: что на чём стоит, все API, сервисы, запуск. Статус: черновик от 24.09.

## Backend — `backend/`

| Что | Технология |
|-----|------------|
| Язык | Python 3.13 |
| Фреймворк | FastAPI 0.128 + uvicorn |
| Валидация | pydantic (модели `VoiceIn`, `QrIn`, `SessionIn`) |
| HTTP-клиент | urllib (OSRM, LLM — без лишних зависимостей) |
| CORS | открыт (`*`) — черновик, перед продом сузить |
| Статика | `/static` — фото мест и сцен (пока заглушки) |
| Конфиг/секреты | `backend/.env` (не коммитится), пример — `.env.example` |
| Запуск | `python -m uvicorn app.main:app --port 8000` |

### Внешние сервисы бэка (ключи только на сервере)

| Сервис | Зачем | Ключ | Статус |
|--------|-------|------|--------|
| OSRM public | пеший routing | не нужен | ✅ работает |
| Gemini API (`gemini-2.0-flash`) | понимание + ответы на любом языке, перевод каталога | `GEMINI_API_KEY` | ⬜ ждёт ключ (B7) |
| OpenAI-совместимый (`gpt-4o-mini`) | то же, альтернатива | `OPENAI_API_KEY` | ⬜ ждёт ключ (B7) |
| OpenAI TTS | озвучка ответа на языке туриста (B11) | тот же `OPENAI_API_KEY` | ⬜ (B11) |

Языки: основные **kk/ru/en** без иерархии (default `kk`); любой другой (zh, pt-BR…) — через LLM/TTS.

Код: `backend/app/llm.py` (провайдеры), подключение в `voice` и `places`. Без ключа — правила/русский.

## Frontend — `frontend/`

| Что | Технология |
|-----|------------|
| Язык | TypeScript |
| Фреймворк | React + Vite |
| Карта | **Leaflet** + тайлы OSM (без ключа), границы Мангистау, minZoom 7 |
| Голосовой ввод | Web Speech API (Chrome, ru/en/kk), автостарт, текстовый фолбэк |
| Автовключение | Web Audio API: RMS → dBFS, порог −30 (слайдер −50…−10), гистерезис 8 дБ |
| Спящий режим | тишина 120 сек → большие часы; будят звук/касание |
| QR | `qrcode.react` (SVG) |
| Состояние | React state-машина: idle/catalog/card/recording/processing/error_speech/tarihsky/qr |
| API-клиент | `src/api.ts` строго по `docs/api/frontend.md` |
| Запуск | `npm run dev` → http://localhost:5173 · сборка `npm run build` |

## Железо (стелла)

| Что | Статус |
|-----|--------|
| Экран + ноутбук/мини-ПК + микрофон | нужен для демо (I3) |
| HuskyLens | после стабильного MVP — только приветствие (I4) |
| Точка стелы | AKTAU-EMB-01, амфитеатр у набережной 15-го микрорайона: 43.6582, 51.1352, heading 45° — данные предоставлены бэкендером, сверить на месте |

## API — все эндпоинты

| Метод | Путь | Флоу |
|-------|------|------|
| GET | `/api/config` | 01 (точка, языки, `categories`, таймауты) |
| GET | `/api/places?lang=&q=&categories=&limit=` | 01 (поиск и фильтры — бэк) |
| GET | `/api/places/{id}` | 02 (`hours: null` = открыто всегда) |
| GET | `/api/places/{id}/route?mode=&fallback=` | 02 (`bearing_deg` считает бэк) |
| POST | `/api/voice` | 04 (`lang: auto`, `mode: nav/scene`, лимит аудио 15 с) |
| GET | `/api/places/{id}/scene` | 05 |
| POST | `/api/qr` | 03 |
| POST | `/api/session/end` | 06 |
| GET | `/api/health` | 06 (`db`, `route_provider`, `ai`) |

Полные JSON — в [api/backend.md](api/backend.md). Порядок вызовов — в [api/frontend.md](api/frontend.md).

## Данные (seed, черновик)

- Рабочий seed: 10 мест у амфитеатра в 15-м микрорайоне Актау, прямые источники — `data/places/provenance.json`; нужна проверка командой на месте
- 3 сцены TarihSky: набережная, форт, Шакпак-ата (тексты — заглушки до 0.4)
- Фото мест/сцен — нет, для мест используется подписанная SVG-заглушка до получения разрешённых материалов (0.2/0.4)

## Порты и связи

```
фронт :5173 ──REST──▶ бэк :8000 ──▶ OSRM (пешие маршруты)
                                  ──▶ Gemini / GPT-4o-mini (языки)
  │──▶ OSM tiles (карта)            ◀── STT: браузер (Web Speech)
  └──▶ /r/:token (страница телефона по QR)
```

---

_Менять стек — через техлида. Задачи: [tasks.md](tasks.md)._
