# ⚙️ API и бэкенд-логика

## Эндпоинты

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/...` | Получить данные |
| POST | `/api/...` | Создать/отправить |

## Логика запроса

```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend
    participant D as Database

    F->>B: POST /api/action
    B->>D: запрос
    D-->>B: результат
    B-->>F: JSON ответ
```

## Обработка ошибок

```mermaid
flowchart TD
    A[Запрос] --> B{Валидация}
    B -- OK --> C[Обработка]
    B -- Ошибка --> D[400 Bad Request]
    C --> E[200 OK]
```

---

_Заполни, когда будет кейс._
