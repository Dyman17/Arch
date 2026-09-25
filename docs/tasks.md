# 📋 Задачи — BaGdar

> Берёшь задачу → 🔄 → ветка → PR → ревью техлида → мерж.

## 0. Утверждение до кода (команда вместе, блокер)

| # | Решение | Кто | Статус |
|---|---------|-----|--------|
| 0.1 | Точка установки + heading стеллы (координаты) | все | ⬜ |
| 0.2 | Один район Актау + список 10–20 объектов | техлид + данные | ⬜ |
| 0.3 | Языки v1 (2–3) | все | ⬜ |
| 0.4 | 2–3 сцены TarihSky (одинаковый ракурс, источники) | техлид | ⬜ |
| 0.5 | Провайдеры: tiles, routing, STT, LLM + ключи | техлид | ⬜ |
| 0.6 | Демо-сценарий питча (пошагово) | техлид | ⬜ |

## Frontend — @yernurge (управление только голосом, кнопок нет)

| # | Задача | Ветка | Статус |
|---|--------|-------|--------|
| F1 | Карта-витрина: точки без кликов, зум на место по команде диалога | `feature/map` | ⬜ |
| F2 | Диалог UI: приветствие, субтитры, волна/индикатор, переспрос | `feature/dialog-ui` | ⬜ |
| F3 | Автовключение по dB + запись + отправка voice | `feature/voice-ui` | ⬜ |
| F4 | Показ места: зум, маршрут, стрелка `bearing−heading` | `feature/route-ui` | ⬜ |
| F5 | TarihSky: автопоказ + голосовое листание | `feature/tarihsky-ui` | ⬜ |
| F6 | QR-экран по команде + таймаут 60 сек | `feature/qr-ui` | ⬜ |
| F7 | Сон с часами, языки авто, таймауты, сброс | `feature/session-l10n` | ⬜ |

## Backend — @RKydyrali

| # | Задача | Ветка | Статус |
|---|--------|-------|--------|
| B1 | Модели + seed: 10–20 places, hours, access, языки | `feature/seed` | 🔄 |
| B1.1 | `local_text`: фолбэк на ru для zh/любого другого (сейчас KeyError) | `fix/catalog-fallback` | ⬜ |
| B1.2 | Каталоги: город (10, ids 1–10) + регион (ids 101+, Форт/Божыра…), без коллизий | `feature/seed-region` | ⬜ |
| B2 | `GET config`, `GET places`, `GET places/{id}`, `GET route` (+ fallback) | `feature/api-places` | 🔄 |
| B3 | `POST voice`: STT, lang auto, intent → place_id / suggestions, mode scene | `feature/api-voice` | ⬜ |
| B4 | `GET scene`, `POST qr`, `POST session/end`, `GET health` | `feature/api-scene-qr` | ⬜ |
| B5 | Seed 2–3 scenes + тексты + sources | `feature/seed-scenes` | ⬜ |
| B6 | .env, ключи, rate-limit, единый error-format | `feature/ops-api` | ⬜ |
| B7 | LLM: вставить ключ в `backend/.env` (`LLM_PROVIDER` + `GEMINI_API_KEY` / `OPENAI_API_KEY`), перезапустить, `GET health` → `"ai": true` | `feature/llm-key` | ⬜ |
| B8 | LLM: проверить голос на 4 языках (kk/ru/en + китайский), каталог на неродном языке, фоллбэк без ключа | `feature/llm-i18n` | ⬜ |
| B11 | TTS через OpenAI (ответ вслух на языке туриста): `POST /api/tts` → аудио; фронт проигрывает | `feature/api-tts` | ⬜ |
| B9 | `GET /api/stats`: популярные места, языки, сессии (цифры для питча + акимат) | `feature/api-stats` | ⬜ |
| B10 | `POST /api/feedback`: 👍/👎 на ответ (петля обучения) | `feature/api-feedback` | ⬜ |
| B12 | Память диалога: контекст сессии (turns, места, prefs), местоимения («рядом с ним»), сброс при end/timeout/сне | `feature/dialog-memory` | ⬜ |

## Интеграция / общее

| # | Задача | Ветка | Кто | Статус |
|---|--------|-------|-----|--------|
| I1 | Сквозной сценарий: голос → маршрут → QR на девайсе | `feature/integration` | все | ⬜ |
| I2 | Деградация: нет STT → текстовый фолбэк техлида; нет routing → прямая | `feature/fallbacks` | оба | ⬜ |

## Железо — hardware (обычная работа, отдельно от софта)

| # | Задача | Статус |
|---|--------|--------|
| H1 | Стелла: не сенсорный монитор + микрофон + динамик + камера + мини-ПК, запуск приложения | ⬜ |
| H2 | HuskyLens: приветствие при подходе человека (после стабильного MVP) | ⬜ |
| H3 | Жесты для немых: авто-алерт после 10 сек молчания («Показывайте!»), MediaPipe Hands, 3–5 статичных жестов → текст в диалог (R&D, roadmap) | ⬜ |
| I3 | Демо-стелла: экран + ноут + микрофон | — | hardware | ⬜ |
| I4 | HuskyLens: приветствие при подходе (после I1 стабильно) | `feature/huskylens` | hardware | ⬜ |

## Техлид — @Dyman17

| # | Задача | Ветка | Статус |
|---|--------|-------|--------|
| T1 | Провайдеры карт/маршрутов/STT/LLM, ключи в .env | `chore/providers` | ⬜ |
| T2 | Ревью всех PR, мерж в main | — | ⬜ |
| T3 | README, слайды PDF ≤10, сценарий 4-мин питча | `docs/pitch` | ⬜ |
| T4 | Деплой MVP + проверка по критериям ТЗ | `chore/deploy` | ⬜ |
| T5 | Проверка мест и исторических материалов | — | ⬜ |

## Порядок

```
0.x решения (вместе)
День 1:  B1 → B2        F1 → F2
         T1 параллельно  T3 черновик
День 2 утро:  B3 → B4 → B5    F3 → F4 → F5 → F6 → F7
           B7 → B8 (LLM: ключ + 3 языка) — как только готов voice
День 2 день:  I1 + I2 → I3 → T4
Опционально: I4, B6
Питч: T3, репетиция T6
```

## Ветки (шаблоны)

```bash
feature/map | feature/ui-core | feature/voice-ui | feature/route-ui
feature/seed | feature/api-places | feature/api-voice | feature/api-scene-qr
feature/llm-key | feature/llm-i18n
feature/integration | docs/pitch | chore/deploy
```

## Как делать B7–B8 (LLM, бэкендер)

Цель: стойка понимает и отвечает на любом языке (китайский и т.д.).

1. Скопировать `backend/.env.example` → `backend/.env` (файл не коммитится)
2. Выбрать провайдера: `LLM_PROVIDER=gemini` + `GEMINI_API_KEY` **или** `LLM_PROVIDER=openai` + `OPENAI_API_KEY` (модель по умолчанию `gpt-4o-mini`)
3. Перезапустить бэк, проверить `GET /api/health` → `"ai": true`
4. Проверить `POST /api/voice` с текстом на четырёх языках (kk/ru/en/zh): в ответе `place_id` + `answer` на языке запроса, в `debug` — `"via": "llm"`
5. Проверить `GET /api/places?lang=zh` — названия/описания переведены
6. Убрать ключ → убедиться, что всё падает на правила/русский без ошибок (деградация)

## B11. TTS (озвучка ответа)

Цель: стойка не только показывает, но и **говорит** на языке туриста (китайский, бразильский и т.д.).

1. Провайдер — OpenAI TTS (ключ тот же `OPENAI_API_KEY`)
2. Контракт предложить техлиду до кода (вариант: `POST /api/tts` `{ text, lang }` → `{ audio_url }` или base64)
3. Фронт: проиграть аудио после показа ответа; без аудио — всё работает молча (деградация)
4. Код `llm.py` расширить, не ломая frozen-контракты без PR

Код уже готов: `backend/app/llm.py` (провайдеры + перевод), подключение в `voice` и `places`. Ключ только добавляешь.

---

- Контракты: [api-flow.md](api-flow.md) — не ломать без PR туда же
- Флоучарты: [user-flow.md](user-flow.md)
- Правила Git / DoD: [../AGENTS.md](../AGENTS.md)
