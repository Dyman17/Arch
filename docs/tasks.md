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

## Frontend — @yernurge

| # | Задача | Ветка | Статус |
|---|--------|-------|--------|
| F1 | Vite + React + TS + MapLibre: карта района, фикс-центр стеллы | `feature/map` | ⬜ |
| F2 | Idle-экран, приветствие, каталог мест, карточка места | `feature/ui-core` | ⬜ |
| F3 | Кнопка микрофона: запись, спиннер processing, экран error_speech | `feature/voice-ui` | ⬜ |
| F4 | Маршрут: polyline, метаданные, стрелка `bearing_deg`, текст направления | `feature/route-ui` | ⬜ |
| F5 | TarihSky: экран сцены, ползунок, текст, бейдж реконструкции | `feature/tarihsky-ui` | ⬜ |
| F6 | QR-экран + таймауты | `feature/qr-ui` | ⬜ |
| F7 | Языки (переключатель), таймаут сеанса, возврат на главный, состояния загрузки | `feature/session-l10n` | ⬜ |

## Backend — @RKydyrali

| # | Задача | Ветка | Статус |
|---|--------|-------|--------|
| B1 | Модели + seed: 10–20 places, hours, access, языки | `feature/seed` | ⬜ |
| B2 | `GET config`, `GET places`, `GET places/{id}`, `GET route` (+ fallback) | `feature/api-places` | ⬜ |
| B3 | `POST voice`: STT, lang auto, intent → place_id / suggestions, mode scene | `feature/api-voice` | ⬜ |
| B4 | `GET scene`, `POST qr`, `POST session/end`, `GET health` | `feature/api-scene-qr` | ⬜ |
| B5 | Seed 2–3 scenes + тексты + sources | `feature/seed-scenes` | ⬜ |
| B6 | .env, ключи, rate-limit, единый error-format | `feature/ops-api` | ⬜ |

## Интеграция / общее

| # | Задача | Ветка | Кто | Статус |
|---|--------|-------|-----|--------|
| I1 | Сквозной сценарий: голос → маршрут → QR на девайсе | `feature/integration` | все | ⬜ |
| I2 | Деградация: нет STT → кэш каталога; нет routing → прямая | `feature/fallbacks` | оба | ⬜ |
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
День 2 день:  I1 + I2 → I3 → T4
Опционально: I4, B6
Питч: T3, репетиция T6
```

## Ветки (шаблоны)

```bash
feature/map | feature/ui-core | feature/voice-ui | feature/route-ui
feature/seed | feature/api-places | feature/api-voice | feature/api-scene-qr
feature/integration | docs/pitch | chore/deploy
```

---

- Контракты: [api-flow.md](api-flow.md) — не ломать без PR туда же
- Флоучарты: [user-flow.md](user-flow.md)
- Правила Git / DoD: [../AGENTS.md](../AGENTS.md)
