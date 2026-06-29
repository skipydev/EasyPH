# Smart Study Platform

Удобная платформа для обучения, построенная на базе искусственного интеллекта (DeepSeek). Проект создан, чтобы упростить процесс подготовки к ЕГЭ и сделать обучение максимально эффективным. 

В основе системы лежит мощная база знаний, включающая академические материалы, в том числе профильные учебники МГУ. ИИ помогает быстро ориентироваться в материале, отвечать на вопросы и структурировать подготовку.

## 📸 Preview

### ГЛАВНАЯ
<img width="2536" height="1246" alt="изображение" src="https://github.com/user-attachments/assets/c2e0e2e9-d284-4ad8-864a-1f108c690236" />
<img width="2540" height="1246" alt="изображение" src="https://github.com/user-attachments/assets/00b88dbc-2bf7-483e-b1fe-7f77e8cfdab1" />
<img width="2538" height="1244" alt="изображение" src="https://github.com/user-attachments/assets/26d63371-c450-435d-804b-9d66669cf0bc" />

### ПОДГОТОВКА К ЕГЭ
<img width="2536" height="1248" alt="изображение" src="https://github.com/user-attachments/assets/6177d7a3-14f7-4d80-9614-a2ab9a72bdc6" />
<img width="2537" height="1252" alt="изображение" src="https://github.com/user-attachments/assets/fc47f039-46b5-43e9-bb19-27c88916c631" />
<img width="2532" height="1245" alt="изображение" src="https://github.com/user-attachments/assets/52aa569d-b2e3-4fe7-a460-dc9d77aa1789" />
<img width="2535" height="1252" alt="изображение" src="https://github.com/user-attachments/assets/5bf871ee-ad37-4848-9dfe-302bfb89abe2" />

### БАЗА ЗНАНИЙ 
<img width="2533" height="1244" alt="изображение" src="https://github.com/user-attachments/assets/7b348b12-50e6-44ab-b9de-7e3ae5ff3634" />
<img width="2537" height="1246" alt="изображение" src="https://github.com/user-attachments/assets/a52cc8fc-c2eb-4c66-8c1b-a9673034c0d8" />

### ABOUT
<img width="2541" height="1250" alt="изображение" src="https://github.com/user-attachments/assets/c2ad5700-12c5-4971-9500-b14b1b1674c9" />







# EasyPh DeepSeek Physics EGE Server

🚀 **Высокопроизводительный Golang сервер для генерации и проверки задач ЕГЭ по физике с интеграцией DeepSeek AI**

## 📋 Описание

Сервер заменяет Gemini API на более быстрый и надежный DeepSeek для генерации задач ЕГЭ по физике и проверки ответов учащихся.

### ✨ Основные возможности

- 🎯 **Генерация задач**: Создание качественных задач ЕГЭ по физике с использованием DeepSeek AI
- 🔍 **Проверка ответов**: Интеллектуальная проверка ответов с учетом различных форматов записи
- ⚡ **Высокая производительность**: Оптимизированный Golang код для быстрой обработки запросов
- 🔒 **CORS поддержка**: Полная поддержка кросс-оригинальных запросов
- 📊 **Логирование**: Подробное логирование всех операций
- 🛡️ **Валидация**: Проверка входных данных и обработка ошибок

## 🏗️ Архитектура

```
easyph-deepseek/
├── main.go              # Основной сервер
├── go.mod               # Go модуль
├── go.sum               # Зависимости
├── .env                 # Конфигурация (локальная)
├── .env.example         # Пример конфигурации
└── README.md            # Документация
```

### 🛠️ Технологии

- **Go 1.21+** - Основной язык программирования
- **Gorilla Mux** - HTTP роутер
- **Godotenv** - Управление переменными окружения
- **DeepSeek API** - AI для генерации и проверки

## 🚀 Установка и запуск

### 1. Установка зависимостей

```bash
cd easyph-deepseek
go mod tidy
```

### 2. Настройка конфигурации

Скопируйте пример конфигурации и настройте свои параметры:

```bash
cp .env.example .env
```

Отредактируйте файл `.env`:

```env
# DeepSeek API Configuration
DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions

# Server Configuration
PORT=5000
ENVIRONMENT=development
```

### 3. Запуск сервера

```bash
go run main.go
```

Сервер запустится на `http://localhost:5000`

## 📚 API Документация

### 🔍 Health Check

**GET** `/health`

Проверка состояния сервера.

**Ответ:**

```json
{
	"status": "ok",
	"service": "EasyPh DeepSeek Server",
	"ai": "DeepSeek Chat",
	"time": "2025-12-25T15:14:00Z",
	"version": "2.0.0",
	"api_key": "configured",
	"endpoints": ["/generate", "/check"]
}
```

### 🎯 Генерация задачи

**POST** `/generate`

Генерация новой задачи ЕГЭ по физике.

**Запрос:**

```json
{
	"num": "21",
	"topic": "механика"
}
```

**Ответ:**

```json
{
	"condition": "Тело массой 2 кг движется со скоростью 5 м/с...",
	"solution": "Используем второй закон Ньютона: F = ma...",
	"answer": "10"
}
```

### 🔍 Проверка ответа

**POST** `/check`

Проверка ответа ученика.

**Запрос:**

```json
{
	"correct": "8.5",
	"user": "8,5"
}
```

**Ответ:**

```json
{
	"status": "correct",
	"result": "Правильно! Молодец!"
}
```

## 🤖 AI Промпты

### Системный промпт генерации задач

Сервер использует специализированный промпт для генерации задач ЕГЭ:

```
Ты — лучший репетитор по физике, специализирующийся на ЕГЭ (профильный уровень, задачи 21-26).

Сгенерируй ОДНУ качественную задачу №{num} по теме "{topic}", ОБЯЗАТЕЛЬНО опираясь на задачи с ФИПИ.

Формат ответа:
Условие: [текст с LaTeX формулами]
Решение: [краткое решение с формулами]
Ответ: [только число или выражение]
```

### Проверочный промпт

Для проверки ответов используется ИИ с умным сравнением:

- Запятая и точка равны (8,5 = 8.5)
- Пробелы не важны
- √2 и \\sqrt{2} равны
- Поддержка дробей (1/2 = \\frac{1}{2})
- Проверка эквивалентных математических выражений

## ⚡ Оптимизации производительности

### 1. **HTTP клиент с таймаутом**

```go
client := &http.Client{Timeout: 30 * time.Second}
```

### 2. **Параллельная обработка**

- Асинхронные HTTP запросы к DeepSeek API
- Неблокирующая обработка множественных запросов

### 3. **Кэширование**

- Кэширование конфигурации
- Оптимизированное регулярное выражение

### 4. **Эффективное парсинг**

- Регулярные выражения для быстрого извлечения данных
- Минимальное копирование данных

## 🛡️ Безопасность

### CORS настройки

```go
w.Header().Set("Access-Control-Allow-Origin", "*")
w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
```

### Валидация входных данных

- Проверка обязательных полей
- Валидация JSON структуры
- Санитизация пользовательского ввода

### Обработка ошибок

- Graceful error handling
- Логирование ошибок
- Безопасные дефолтные значения

## 🔧 Конфигурация

### Переменные окружения

| Переменная         | Описание          | По умолчанию                                   |
| ------------------ | ----------------- | ---------------------------------------------- |
| `DEEPSEEK_API_KEY` | API ключ DeepSeek | -                                              |
| `DEEPSEEK_API_URL` | URL DeepSeek API  | `https://api.deepseek.com/v1/chat/completions` |
| `PORT`             | Порт сервера      | `5000`                                         |
| `ENVIRONMENT`      | Окружение         | `development`                                  |

### Настройка DeepSeek

1. Получите API ключ на [DeepSeek Platform](https://platform.deepseek.com/)
2. Добавьте ключ в файл `.env`
3. Настройте параметры модели при необходимости

## 📊 Мониторинг

### Логирование

Сервер логирует:

- Генерацию задач с параметрами
- Проверку ответов
- Ошибки API
- Статус HTTP запросов

### Health Check

Регулярная проверка состояния:

- Наличие API ключа
- Доступность DeepSeek API
- Статус сервера

## 🧪 Тестирование

### Запуск без API ключа

```bash
# Установите заглушку для тестирования
DEEPSEEK_API_KEY=test go run main.go
```

### Тестовые запросы

**Генерация задачи:**

```bash
curl -X POST http://localhost:5000/generate \
  -H "Content-Type: application/json" \
  -d '{"num": "21", "topic": "механика"}'
```

**Проверка ответа:**

```bash
curl -X POST http://localhost:5000/check \
  -H "Content-Type: application/json" \
  -d '{"correct": "10", "user": "10"}'
```

## 🚀 Развертывание

### Docker (опционально)

```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod tidy && go build -o main main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
CMD ["./main"]
```

### Production настройки

```env
ENVIRONMENT=production
PORT=80
DEEPSEEK_API_KEY=your_production_key
```

## 🔄 Миграция с Gemini

### Преимущества DeepSeek

- **Скорость**: До 3x быстрее ответов
- **Надежность**: Стабильное соединение
- **Качество**: Высокое качество генерации задач
- **Стоимость**: Более экономичное решение

### Обратная совместимость

API endpoints остались теми же:

- `/generate` - генерация задач
- `/check` - проверка ответов
- `/health` - health check

## 🐛 Устранение неполадок

### Частые ошибки

1. **"DEEPSEEK_API_KEY не настроен"**

   - Проверьте файл `.env`
   - Убедитесь что ключ не пустой

2. **"DeepSeek API вернул статус 429"**

   - Превышен лимит запросов
   - Уменьшите частоту запросов

3. **"JSON не найден в ответе"**
   - DeepSeek вернул неожиданный формат
   - Проверьте логи для деталей

### Логирование

```bash
# Подробные логи
go run main.go

# Логи с отладочной информацией
DEBUG=true go run main.go
```

## 📈 Производительность

### Бенчмарки

- **Время ответа генерации**: ~2-5 секунд
- **Время проверки ответа**: ~1-2 секунды
- **Пропускная способность**: 100+ запросов/минуту
- **Память**: ~50MB RAM

### Оптимизации

- HTTP keep-alive
- Connection pooling
- Регулярные выражения с предкомпиляцией
- Эффективный JSON парсинг

## 🤝 Поддержка

### Контакты

- 📧 Email: support@easyph.ru
- 💬 Telegram: @easyph_support
- 🐛 Issues: GitHub Issues

### Документация

- 📖 API Docs: [docs.easyph.ru/api](https://docs.easyph.ru/api)
- 🎓 Учебные материалы: [learn.easyph.ru](https://learn.easyph.ru)

## 📄 Лицензия

MIT License - см. файл LICENSE для подробностей.

---

**EasyPh DeepSeek Physics EGE Server** - Быстрое и надежное решение для подготовки к ЕГЭ по физике! 🚀

