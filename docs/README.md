# 📚 Документация проекта — BaGdar

> Инструкция для команды и их ИИ-агентов. Читай перед началом работы.

## 🗺 Навигация

| Файл | Описание |
|------|----------|
| [ideas.md](ideas.md) | ✅ Идея BaGdar, объём v1, критерий готовности |
| [tech-stack.md](tech-stack.md) | **Стек: бэк, фронт, железо, API, сервисы** |
| [flows/](flows/README.md) | **Флоу по функционалам 01–06: флоучарт + контракт куска** |
| [api/](api/README.md) | **API: общий док + контракты бэку и фронту отдельно** |
| [api-flow.md](api-flow.md) | Указатель на api/ |
| [user-flow.md](user-flow.md) | Указатель на flows/ |
| [architecture.md](architecture.md) | Архитектура и стек |
| [api-flow.md](api-flow.md) | **Полные API-контракты** — фронт/бэк только по ним |
| [tasks.md](tasks.md) | Блокер #0 + задачи F*/B*/T* |

---

## 🚀 Быстрый старт

```bash
git clone https://github.com/Dyman17/Arch.git
cd Arch
```

### Правила Git

```
❌  НИКОГДА не пиши в main напрямую
✅  Задача = ветка feature/...
✅  Перед работой: git pull origin main
✅  PR → ревью техлида → только техлид мержит
❌  Не менять api-flow.md без PR (техлид)
```

```bash
git checkout main && git pull origin main
git checkout -b feature/название
# ... работа ...
git add . && git commit -m "feat: ..."
git push origin feature/название
gh pr create --fill
```

---

## 👥 Роли

| Кто | Зона |
|-----|------|
| **Техлид** [@Dyman17](https://github.com/Dyman17) | Решения #0, провайдеры/ключи, ревью, интеграция, деплой, питч |
| **Backend** [@RKydyrali](https://github.com/RKydyrali) | FastAPI, каталог, route, voice, scene, qr, seed |
| **Frontend** [@yernurge](https://github.com/yernurge) | React-экраны стеллы, MapLibre, голос UI, TarihSky, QR, l10n |

---

## 📝 Порядок работы

1. **Вместе:** `tasks.md` #0 (точка, объекты, языки, сцены, провайдеры)
2. **Параллельно:** B1–B2 ∥ F1–F2; техлид T1
3. **Дальше:** голос, маршрут, TarihSky, QR
4. **Вместе:** I1 сквозной сценарий + фоллбэки I2
5. **Устройство + люди** → HuskyLens (I4) → деплой T4

Каждые 2–3 часа — синхронизация, статусы в `tasks.md`.

---

## ⚡ Команды дня

```bash
git pull origin main
git checkout -b feature/xxx
git add . && git commit -m ""
git push origin feature/xxx
gh pr create --fill
# мержит только техлид
```

---

## 🚫 Запрещено

- Писать в `main` без PR
- `.env`, ключи, пароли в коммитах
- Ключи API во фронте
- Force-push, удаление чужих коммитов
- Мерж без ревью
- Менять контракты `api-flow.md` молча
- Выдумывать места не из каталога на стороне клиента
