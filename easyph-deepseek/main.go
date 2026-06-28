package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

type Config struct {
	DeepSeekAPIKey string
	DeepSeekURL    string
	Port           string
}

type DeepSeekMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type DeepSeekRequest struct {
	Model       string           `json:"model"`
	Messages    []DeepSeekMessage `json:"messages"`
	Temperature float64          `json:"temperature"`
	TopP        float64          `json:"top_p"`
	MaxTokens   int              `json:"max_tokens"`
	Stream      bool             `json:"stream"`
}

type DeepSeekChoice struct {
	Message DeepSeekMessage `json:"message"`
}

type DeepSeekResponse struct {
	Choices []DeepSeekChoice `json:"choices"`
	Usage   struct {
		TotalTokens int `json:"total_tokens"`
	} `json:"usage"`
}


type GenerateTaskRequest struct {
	Num   string `json:"num"`
	Topic string `json:"topic"`
}

type GenerateTaskResponse struct {
	Condition string `json:"condition"`
	Solution  string `json:"solution"`
	Answer    string `json:"answer"`
}

type CheckAnswerRequest struct {
	Correct string `json:"correct"`
	User    string `json:"user"`
}

type CheckAnswerResponse struct {
	Status string `json:"status"`
	Result string `json:"result"`
}

const SYSTEM_PROMPT_TEMPLATE = `Ты — лучший репетитор по физике, специализирующийся на ЕГЭ (профильный уровень, задачи 21-26).

Сгенерируй ОДНУ качественную задачу №{num} по теме "{topic}", ОБЯЗАТЕЛЬНО опираясь на задачи с ФИПИ. ДЛЯ ЗАДАЧИ 26 ОБЯЗАТЕЛЬНО делай разнообразные темы.

Строгий формат ответа (ни одного лишнего слова!):

Условие:
[текст условия, используй только LaTeX для формул, Если в задаче есть электрическая цепь — обязательно нарисуй схему с помощью circuitikz.
]

Решение:
[МАКСИМАЛЬНО краткое решение с ОБЯЗАТЕЛЬНО краткими объяснениями и ОБЯЗАТЕЛЬНО БЕЗ рассуждений, но с пояснениями и всеми формулами в LaTeX. РЕШАЙ БЕЗ ДАНО, СРАЗУ ПРИСТУПАЙ К РЕШЕНИЮ. Сначала решай в общем виде а потом подставляй значения. Все большие значения старайся сокращать если возможно]

Ответ:
[ТОЛЬКО число или выражение, как в бланке ЕГЭ, например: 15 или 8,5 или 2. Если возможно привести к целому значению, вписывай посчитанную дробь]`


const CHECK_PROMPT_TEMPLATE = `Ты — строгий проверяльщик ЕГЭ по физике.
Правильный ответ: {correct}
Ответ ученика: {user}

Сравни их. Учти:
- запятая и точка равны (8,5 = 8.5)
- пробелы не важны
- \\\\sqrt{2} и √2 равны
- можно принять ответ не в общем виде
- порядок множителей не важен
- дроби типа 1/2 равна \\frac{1}{2}

Ответь только JSON:
{{
  "status": "correct" | "wrong" | "almost",
  "result": "Правильно! Молодец!" или "Неправильно. Правильный ответ: 8,5" или "Почти верно"
}}`

var config *Config


const (
	TASKS_FILE = "tasks_data.json"
	PROGRESS_FILE = "user_progress.json"
)

type PhysicsTask struct {
	ID          string `json:"id"`
	Number      string `json:"number"`
	Topic       string `json:"topic"`
	Difficulty  string `json:"difficulty"`
	Condition   string `json:"condition"`
	Solution    string `json:"solution"`
	Answer      string `json:"answer"`
	Category    string `json:"category"`
	Points      int    `json:"points"`
	TimeLimit   int    `json:"timeLimit"`
	GeneratedAt string `json:"generatedAt"`
}

type TasksDatabase struct {
	Tasks    []PhysicsTask `json:"tasks"`
	Updated  string        `json:"updated"`
	Version  string        `json:"version"`
}

func main() {
	config = loadConfig()
	
	go initTasksDatabaseAsync()
	
	r := mux.NewRouter()
	
	r.Use(corsMiddleware)
	
	r.HandleFunc("/generate", generateTaskHandler).Methods("POST")
	r.HandleFunc("/generate", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}).Methods("OPTIONS")
	
	// Check answer
	r.HandleFunc("/check", checkAnswerHandler).Methods("POST")
	r.HandleFunc("/check", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}).Methods("OPTIONS")
	
	// Health check
	r.HandleFunc("/health", healthHandler).Methods("GET")
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}).Methods("OPTIONS")
	
	// === Legacy API endpoints ===
	// Health check legacy
	r.HandleFunc("/api/health", healthHandler).Methods("GET")
	r.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}).Methods("OPTIONS")
	
	// Generate task legacy
	r.HandleFunc("/api/tasks/generate", generateTaskHandler).Methods("POST")
	r.HandleFunc("/api/tasks/generate", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}).Methods("OPTIONS")
	
	// Validate answer legacy
	r.HandleFunc("/api/tasks/validate-answer", validateAnswerHandler).Methods("POST")
	r.HandleFunc("/api/tasks/validate-answer", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}).Methods("OPTIONS")
	
	// Progress endpoints
	r.HandleFunc("/api/progress/{userId}", progressHandler).Methods("GET", "POST", "OPTIONS")
	
	// Level test endpoints
	r.HandleFunc("/api/levels/test", startLevelTestHandler).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/levels/submit", submitLevelTestHandler).Methods("POST", "OPTIONS")
	
	// Tasks database endpoints
	r.HandleFunc("/api/tasks", getTasksHandler).Methods("GET", "OPTIONS")
	
	// === Catch-all handler для неизвестных маршрутов ===
	r.HandleFunc("/{path:.*}", notFoundHandler).Methods("GET", "POST", "PUT", "DELETE", "OPTIONS")
	
	port := ":" + config.Port
	if config.Port == "" {
		port = ":5000"
	}
	
	fmt.Printf("EasyPh DeepSeek Server запущен на http://localhost%s\n", port)
	fmt.Printf("Health check: http://localhost%s/health\n", port)
	fmt.Printf("Generate task: POST http://localhost%s/generate\n", port)
	fmt.Printf("Check answer: POST http://localhost%s/check\n", port)
	fmt.Printf("Legacy API: http://localhost%s/api/*\n", port)
	
	log.Fatal(http.ListenAndServe(port, r))
}

// CORS middleware - улучшенная версия
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Всегда устанавливаем CORS заголовки
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin")
		w.Header().Set("Access-Control-Allow-Credentials", "false")
		w.Header().Set("Access-Control-Max-Age", "86400") // 24 hours
		
		// Обрабатываем preflight запросы
		if r.Method == "OPTIONS" {
			log.Printf("CORS preflight: %s %s", r.Method, r.URL.Path)
			w.WriteHeader(http.StatusOK)
			return
		}
		
		// Логируем все запросы для отладки
		log.Printf("%s %s %s", r.Method, r.URL.Path, r.RemoteAddr)
		
		next.ServeHTTP(w, r)
	})
}

// Загрузка конфигурации
func loadConfig() *Config {
	// Загружаем .env файл
	if err := godotenv.Load(); err != nil {
		log.Printf("Не удалось загрузить .env файл: %v", err)
	}
	
	return &Config{
		DeepSeekAPIKey: os.Getenv("DEEPSEEK_API_KEY"),
		DeepSeekURL:    getEnv("DEEPSEEK_API_URL", "https://api.deepseek.com/v1/chat/completions"),
		Port:           getEnv("PORT", "5000"),
	}
}

// Вспомогательная функция для получения переменных окружения
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// 404 handler
func notFoundHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("404: %s %s", r.Method, r.URL.Path)
	
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNotFound)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"error": "Endpoint not found",
		"method": r.Method,
		"path": r.URL.Path,
		"available_endpoints": []string{
			"GET /health",
			"POST /generate", 
			"POST /check",
			"GET /api/health",
			"POST /api/tasks/generate",
			"POST /api/tasks/validate-answer",
			"GET /api/progress/{userId}",
			"POST /api/progress/{userId}",
			"POST /api/levels/test",
			"POST /api/levels/submit",
		},
	})
}

// Health check handler
func healthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	
	// Проверяем статус базы данных
	tasksDBStatus := getTasksDatabaseStatus()
	
	response := map[string]interface{}{
		"status":    "ok",
		"service":   "EasyPh DeepSeek Server",
		"ai":        "DeepSeek Chat",
		"time":      time.Now().Format(time.RFC3339),
		"version":   "2.0.0",
		"api_key":   getAPIKeyStatus(),
		"endpoints": []string{"/generate", "/check", "/health"},
		"legacy_api": "/api/* endpoints available",
		"tasks_db":  tasksDBStatus,
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Проверка статуса базы данных задач
func getTasksDatabaseStatus() map[string]interface{} {
	if _, err := os.Stat(TASKS_FILE); err != nil {
		return map[string]interface{}{
			"status": "initializing",
			"message": "База задач генерируется в фоне",
		}
	}
	
	db, err := loadTasksDatabase()
	if err != nil {
		return map[string]interface{}{
			"status": "error",
			"message": fmt.Sprintf("Ошибка загрузки базы: %v", err),
		}
	}
	
	return map[string]interface{}{
		"status":   "ready",
		"total":    len(db.Tasks),
		"updated":  db.Updated,
		"version":  db.Version,
		"message":  fmt.Sprintf("База готова: %d задач", len(db.Tasks)),
	}
}

// Проверка статуса API ключа
func getAPIKeyStatus() string {
	if config.DeepSeekAPIKey == "" {
		return "not_configured"
	}
	if strings.Contains(config.DeepSeekAPIKey, "your_") || strings.Contains(config.DeepSeekAPIKey, "example") {
		return "placeholder"
	}
	return "configured"
}

// Generate task handler
func generateTaskHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	
	var req GenerateTaskRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}
	
	// Устанавливаем значения по умолчанию
	if req.Num == "" {
		req.Num = "??"
	}
	if req.Topic == "" {
		req.Topic = "Физика"
	}
	
	log.Printf("Генерация задачи %s по теме: %s", req.Num, req.Topic)
	
	// Создаем системный промпт
	systemPrompt := strings.ReplaceAll(SYSTEM_PROMPT_TEMPLATE, "{num}", req.Num)
	systemPrompt = strings.ReplaceAll(systemPrompt, "{topic}", req.Topic)
	
	// Вызываем DeepSeek API
	task, err := callDeepSeekAPI(systemPrompt, true)
	if err != nil {
		log.Printf("Ошибка генерации задачи: %v", err)
		// Возвращаем mock данные при ошибке
		mockTask := getMockTask(req.Num, req.Topic)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(mockTask)
		return
	}
	
	// Парсим результат
	parsedTask := parseTaskResponse(task)
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(parsedTask)
}

// Check answer handler
func checkAnswerHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	
	var req CheckAnswerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}
	
	if req.Correct == "" || req.User == "" {
		http.Error(w, "Correct and User answers are required", http.StatusBadRequest)
		return
	}
	
	log.Printf("Проверка ответа: пользователь=%s, правильный=%s", req.User, req.Correct)
	
	// Создаем проверочный промпт
	checkPrompt := strings.ReplaceAll(CHECK_PROMPT_TEMPLATE, "{correct}", req.Correct)
	checkPrompt = strings.ReplaceAll(checkPrompt, "{user}", req.User)
	
	// Вызываем DeepSeek API
	response, err := callDeepSeekAPI(checkPrompt, false)
	if err != nil {
		log.Printf("Ошибка проверки ответа: %v", err)
		// Возвращаем простую проверку при ошибке
		result := simpleAnswerCheck(req.Correct, req.User)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(result)
		return
	}
	
	// Парсим JSON ответ
	result, err := parseCheckResponse(response)
	if err != nil {
		log.Printf("Ошибка парсинга ответа: %v", err)
		// Возвращаем простую проверку при ошибке парсинга
		result := simpleAnswerCheck(req.Correct, req.User)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(result)
		return
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// Legacy validate answer handler (совместимость со старым API)
func validateAnswerHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	
	var req struct {
		TaskID     string `json:"taskId"`
		UserAnswer string `json:"userAnswer"`
		UserID     string `json:"userId"`
	}
	
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}
	
	// Простая проверка для демо
	isCorrect := strings.TrimSpace(req.UserAnswer) == "42"
	
	response := map[string]interface{}{
		"success": true,
		"isCorrect": isCorrect,
		"correctAnswer": "42",
		"explanation": "Простая проверка для демо",
		"feedback": func() string {
			if isCorrect {
				return "Отлично! 🎉"
			}
			return "Попробуйте еще раз."
		}(),
		"pointsEarned": func() int {
			if isCorrect {
				return 2
			}
			return 0
		}(),
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Progress handler (mock данные)
func progressHandler(w http.ResponseWriter, r *http.Request) {
	userID := strings.TrimPrefix(r.URL.Path, "/api/progress/")
	
	if r.Method == http.MethodGet {
		// Возвращаем mock прогресс
		progress := getMockProgress(userID)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(progress)
	} else if r.Method == http.MethodPost {
		// Успешное обновление (mock)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"message": "Progress updated successfully (mock)",
		})
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// Start level test handler (mock)
func startLevelTestHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	
	response := map[string]interface{}{
		"success": true,
		"testId": fmt.Sprintf("test_%d", time.Now().Unix()),
		"tasks": []interface{}{},
		"timeLimit": 30,
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Submit level test handler (mock)
func submitLevelTestHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	
	response := map[string]interface{}{
		"success": true,
		"score": 15,
		"maxScore": 20,
		"percentage": 75,
		"level": "intermediate",
		"recommendations": []string{"Продолжайте изучение механики", "Повторите термодинамику"},
		"weakTopics": []string{"термодинамика"},
		"strongTopics": []string{"механика"},
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Простая проверка ответов (fallback)
func simpleAnswerCheck(correct, user string) CheckAnswerResponse {
	// Нормализуем ответы для сравнения
	correctNorm := normalizeAnswer(correct)
	userNorm := normalizeAnswer(user)
	
	isCorrect := correctNorm == userNorm
	
	return CheckAnswerResponse{
		Status: func() string {
			if isCorrect {
				return "correct"
			}
			return "wrong"
		}(),
		Result: func() string {
			if isCorrect {
				return "Правильно! Молодец!"
			}
			return fmt.Sprintf("Неправильно. Правильный ответ: %s", correct)
		}(),
	}
}

// Нормализация ответов для сравнения
func normalizeAnswer(answer string) string {
	// Удаляем пробелы, приводим к нижнему регистру
	normalized := strings.ToLower(strings.ReplaceAll(strings.ReplaceAll(answer, " ", ""), "\t", ""))
	
	// Заменяем запятые на точки для числовых ответов
	normalized = strings.ReplaceAll(normalized, ",", ".")
	
	return normalized
}

// Mock данные для генерации задач
func getMockTask(num, topic string) GenerateTaskResponse {
	return GenerateTaskResponse{
		Condition: fmt.Sprintf("Задача %s по теме %s. Тело массой 2 кг движется со скоростью 5 м/с. Найдите кинетическую энергию тела.", num, topic),
		Solution: "Кинетическая энергия: E = mv²/2 = 2 × 5²/2 = 25 Дж.",
		Answer: "25",
	}
}

// Mock данные прогресса
func getMockProgress(userID string) map[string]interface{} {
	return map[string]interface{}{
		"userId": userID,
		"overallProgress": 65,
		"topicProgress": map[string]int{
			"mechanics": 80,
			"thermodynamics": 45,
			"electrodynamics": 60,
			"optics": 30,
			"quantum": 10,
		},
		"tasksCompleted": 15,
		"totalTasks": 50,
		"accuracyRate": 0.75,
		"timeSpent": 180,
		"streak": 5,
		"lastActivity": time.Now().Format(time.RFC3339),
		"level": "intermediate",
		"badges": []string{"first_task", "streak_5"},
		"createdAt": time.Now().AddDate(0, -1, 0).Format(time.RFC3339),
		"updatedAt": time.Now().Format(time.RFC3339),
	}
}

// Вызов DeepSeek API
func callDeepSeekAPI(prompt string, isSystemPrompt bool) (string, error) {
	if config.DeepSeekAPIKey == "" || strings.Contains(config.DeepSeekAPIKey, "your_") || strings.Contains(config.DeepSeekAPIKey, "example") {
		return "", fmt.Errorf("DEEPSEEK_API_KEY не настроен или содержит placeholder")
	}
	
	messages := []DeepSeekMessage{
		{Role: "user", Content: prompt},
	}
	
	// Для генерации задач добавляем системный промпт
	if isSystemPrompt {
		messages = []DeepSeekMessage{
			{Role: "system", Content: "Ты генерируешь только текст в указанном формате. Никаких приветствий, никакой обёртки."},
			{Role: "user", Content: prompt},
		}
	}
	
	request := DeepSeekRequest{
		Model:       "deepseek-chat",
		Messages:    messages,
		Temperature: 0.9,
		TopP:        0.9,
		MaxTokens:   2500,
		Stream:      false,
	}
	
	jsonData, err := json.Marshal(request)
	if err != nil {
		return "", fmt.Errorf("ошибка создания JSON: %v", err)
	}
	
	client := &http.Client{Timeout: 30 * time.Second}
	req, err := http.NewRequest("POST", config.DeepSeekURL, strings.NewReader(string(jsonData)))
	if err != nil {
		return "", fmt.Errorf("ошибка создания запроса: %v", err)
	}
	
	req.Header.Set("Authorization", "Bearer "+config.DeepSeekAPIKey)
	req.Header.Set("Content-Type", "application/json")
	
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("ошибка HTTP запроса: %v", err)
	}
	defer resp.Body.Close()
	
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("DeepSeek API вернул статус %d", resp.StatusCode)
	}
	
	var deepSeekResp DeepSeekResponse
	if err := json.NewDecoder(resp.Body).Decode(&deepSeekResp); err != nil {
		return "", fmt.Errorf("ошибка декодирования ответа: %v", err)
	}
	
	if len(deepSeekResp.Choices) == 0 {
		return "", fmt.Errorf("пустой ответ от DeepSeek API")
	}
	
	return strings.TrimSpace(deepSeekResp.Choices[0].Message.Content), nil
}

// Парсинг ответа генерации задачи
func parseTaskResponse(text string) GenerateTaskResponse {
	// Регулярные выражения для извлечения частей задачи
	conditionRegex := regexp.MustCompile(`(?is)Условие:\s*([\s\S]*?)(?:\nРешение:|$)`)
	solutionRegex := regexp.MustCompile(`(?is)Решение:\s*([\s\S]*?)(?:\nОтвет:|$)`)
	answerRegex := regexp.MustCompile(`(?is)Ответ:\s*([\s\S]*)$`)
	
	conditionMatch := conditionRegex.FindStringSubmatch(text)
	solutionMatch := solutionRegex.FindStringSubmatch(text)
	answerMatch := answerRegex.FindStringSubmatch(text)
	
	// Извлекаем найденные части
	condition := ""
	solution := ""
	answer := ""
	
	if conditionMatch != nil && len(conditionMatch) > 1 {
		condition = strings.TrimSpace(conditionMatch[1])
	}
	
	if solutionMatch != nil && len(solutionMatch) > 1 {
		solution = strings.TrimSpace(solutionMatch[1])
	}
	
	if answerMatch != nil && len(answerMatch) > 1 {
		answer = strings.TrimSpace(answerMatch[1])
	}
	
	// Устанавливаем значения по умолчанию если что-то не найдено
	if condition == "" {
		condition = "Не удалось сгенерировать условие"
	}
	if solution == "" {
		solution = "Решение отсутствует"
	}
	if answer == "" {
		answer = ""
	}
	
	return GenerateTaskResponse{
		Condition: condition,
		Solution:  solution,
		Answer:    answer,
	}
}

// Парсинг ответа проверки
func parseCheckResponse(text string) (CheckAnswerResponse, error) {
	// Ищем JSON объект в тексте
	jsonRegex := regexp.MustCompile(`\{[\s\S]*\}`)
	jsonMatch := jsonRegex.FindString(text)
	
	if jsonMatch == "" {
		return CheckAnswerResponse{
			Status: "wrong",
			Result: "Неправильно. Попробуйте еще раз.",
		}, fmt.Errorf("JSON не найден в ответе")
	}
	
	var result CheckAnswerResponse
	if err := json.Unmarshal([]byte(jsonMatch), &result); err != nil {
		return CheckAnswerResponse{
			Status: "wrong",
			Result: "Неправильно. Попробуйте еще раз.",
		}, fmt.Errorf("ошибка парсинга JSON: %v", err)
	}
	
	// Валидируем результат
	if result.Status != "correct" && result.Status != "wrong" && result.Status != "almost" {
		result.Status = "wrong"
	}
	
	if result.Result == "" {
		result.Result = "Неправильно. Попробуйте еще раз."
	}
	
	return result, nil
}

// ===== Функции для работы с базой данных задач =====

// Асинхронная инициализация базы данных задач
func initTasksDatabaseAsync() {
	log.Println("🔄 Асинхронная инициализация базы данных задач...")
	
	// Проверяем существует ли файл
	if _, err := os.Stat(TASKS_FILE); err == nil {
		log.Printf("📁 База задач уже существует: %s", TASKS_FILE)
		return
	}
	
	log.Println("🆕 База задач не найдена, начинаем генерацию...")
	
	// Генерируем первую задачу сразу
	firstTask := generateSingleTaskAsync("1", "механика", "beginner")
	if firstTask != nil {
		// Сохраняем первую задачу немедленно
		initialDB := TasksDatabase{
			Tasks:    []PhysicsTask{*firstTask},
			Updated:  time.Now().Format(time.RFC3339),
			Version:  "1.0.0",
		}
		
		if err := saveTasksDatabase(&initialDB); err != nil {
			log.Printf("⚠️  Ошибка сохранения первой задачи: %v", err)
		} else {
			log.Printf("✅ Первая задача сохранена, сервер может начинать работу!")
		}
	} else {
		log.Printf("⚠️  Не удалось сгенерировать первую задачу")
	}
	
	// Генерируем остальные задачи в фоне
	go generateRemainingTasksAsync()
}

// Генерация одной задачи в фоне
func generateSingleTaskAsync(num, topic, difficulty string) *PhysicsTask {
	taskData, err := generateSingleTask(num, topic, difficulty)
	if err != nil {
		log.Printf("⚠️  Ошибка генерации задачи %s %s: %v", num, topic, err)
		// Используем mock данные при ошибке
		taskData = getMockTaskData(num, topic, difficulty)
	}
	
	return &PhysicsTask{
		ID:          fmt.Sprintf("task_%s_%s_%s", topic, difficulty, num),
		Number:      num,
		Topic:       topic,
		Difficulty:  difficulty,
		Condition:   taskData.Condition,
		Solution:    taskData.Solution,
		Answer:      taskData.Answer,
		Category:    getCategoryByTopic(topic),
		Points:      getPointsByDifficulty(difficulty),
		TimeLimit:   getTimeLimitByDifficulty(difficulty),
		GeneratedAt: time.Now().Format(time.RFC3339),
	}
}

// Генерация остальных задач в фоне
func generateRemainingTasksAsync() {
	log.Println("🔄 Начинаем генерацию остальных задач в фоне...")
	
	var allTasks []PhysicsTask
	
	// Определяем темы и уровни сложности
	topics := []string{"механика", "термодинамика", "электродинамика", "оптика", "квантовая"}
	difficulties := []string{"beginner", "intermediate", "advanced"}
	
	taskCounter := 2 // Начинаем с 2, так как первая уже создана
	
	// Генерируем задачи для каждой темы и уровня
	for _, topic := range topics {
		for _, difficulty := range difficulties {
			// Генерируем 5 задач для каждой комбинации
			for i := 1; i <= 5; i++ {
				taskNum := fmt.Sprintf("%d", taskCounter)
				
				// Генерируем задачу через DeepSeek API
				task := generateSingleTaskAsync(taskNum, topic, difficulty)
				if task != nil {
					allTasks = append(allTasks, *task)
					log.Printf("✅ Задача %d/74 сгенерирована: %s (%s)", 
						taskCounter, topic, difficulty)
				}
				
				taskCounter++
				
				// Небольшая пауза чтобы не перегружать API
				time.Sleep(200 * time.Millisecond)
			}
		}
	}
	
	// Обновляем базу данных с полным набором задач
	if len(allTasks) > 0 {
		// Загружаем существующие задачи
		existingDB, err := loadTasksDatabase()
		if err != nil {
			log.Printf("⚠️  Ошибка загрузки существующей базы: %v", err)
			return
		}
		
		// Объединяем задачи
		allTasks = append(existingDB.Tasks, allTasks...)
		
		// Сохраняем обновленную базу
		db := TasksDatabase{
			Tasks:    allTasks,
			Updated:  time.Now().Format(time.RFC3339),
			Version:  "1.0.0",
		}
		
		if err := saveTasksDatabase(&db); err != nil {
			log.Printf("❌ Ошибка сохранения полной базы задач: %v", err)
		} else {
			log.Printf("🎉 База задач полностью обновлена: %d задач", len(allTasks))
		}
	}
}

// Генерация начальных задач
func generateInitialTasks() []PhysicsTask {
	var tasks []PhysicsTask
	
	// Определяем темы и уровни сложности
	topics := []string{"механика", "термодинамика", "электродинамика", "оптика", "квантовая"}
	difficulties := []string{"beginner", "intermediate", "advanced"}
	
	taskCounter := 1
	
	// Генерируем задачи для каждой темы и уровня
	for _, topic := range topics {
		for _, difficulty := range difficulties {
			// Генерируем 5 задач для каждой комбинации
			for i := 1; i <= 5; i++ {
				taskNum := fmt.Sprintf("%d", taskCounter)
				
				// Генерируем задачу через DeepSeek API
				taskData, err := generateSingleTask(taskNum, topic, difficulty)
				if err != nil {
					log.Printf("⚠️  Ошибка генерации задачи %s %s: %v", taskNum, topic, err)
					// Используем mock данные при ошибке
					taskData = getMockTaskData(taskNum, topic, difficulty)
				}
				
				task := PhysicsTask{
					ID:          fmt.Sprintf("task_%s_%s_%s", topic, difficulty, taskNum),
					Number:      taskNum,
					Topic:       topic,
					Difficulty:  difficulty,
					Condition:   taskData.Condition,
					Solution:    taskData.Solution,
					Answer:      taskData.Answer,
					Category:    getCategoryByTopic(topic),
					Points:      getPointsByDifficulty(difficulty),
					TimeLimit:   getTimeLimitByDifficulty(difficulty),
					GeneratedAt: time.Now().Format(time.RFC3339),
				}
				
				tasks = append(tasks, task)
				taskCounter++
				
				// Небольшая пауза чтобы не перегружать API
				time.Sleep(100 * time.Millisecond)
			}
		}
	}
	
	return tasks
}

// Генерация одной задачи через DeepSeek
func generateSingleTask(num, topic, difficulty string) (GenerateTaskResponse, error) {
	// Создаем системный промпт с указанием сложности
	systemPrompt := strings.ReplaceAll(SYSTEM_PROMPT_TEMPLATE, "{num}", num)
	systemPrompt = strings.ReplaceAll(systemPrompt, "{topic}", topic)
	
	// Добавляем информацию о сложности
	systemPrompt += fmt.Sprintf("\n\nУровень сложности: %s", difficulty)
	
	// Вызываем DeepSeek API
	task, err := callDeepSeekAPI(systemPrompt, true)
	if err != nil {
		return GenerateTaskResponse{}, err
	}
	
	// Парсим результат
	return parseTaskResponse(task), nil
}

// Mock данные для задач при ошибках
func getMockTaskData(num, topic, difficulty string) GenerateTaskResponse {
	return GenerateTaskResponse{
		Condition: fmt.Sprintf("Задача %s по теме %s (уровень %s). Тело массой 2 кг движется со скоростью 5 м/с. Найдите кинетическую энергию тела.", num, topic, difficulty),
		Solution:  "Кинетическая энергия: E = mv²/2 = 2 × 5²/2 = 25 Дж.",
		Answer:    "25",
	}
}

// Сохранение базы данных задач
func saveTasksDatabase(db *TasksDatabase) error {
	jsonData, err := json.MarshalIndent(db, "", "  ")
	if err != nil {
		return fmt.Errorf("ошибка маршалинга: %v", err)
	}
	
	err = os.WriteFile(TASKS_FILE, jsonData, 0644)
	if err != nil {
		return fmt.Errorf("ошибка записи файла: %v", err)
	}
	
	return nil
}

// Загрузка базы данных задач
func loadTasksDatabase() (*TasksDatabase, error) {
	jsonData, err := os.ReadFile(TASKS_FILE)
	if err != nil {
		return nil, fmt.Errorf("ошибка чтения файла: %v", err)
	}
	
	var db TasksDatabase
	err = json.Unmarshal(jsonData, &db)
	if err != nil {
		return nil, fmt.Errorf("ошибка парсинга JSON: %v", err)
	}
	
	return &db, nil
}

// Получение категории по теме
func getCategoryByTopic(topic string) string {
	categories := map[string]string{
		"механика":       "mechanics",
		"термодинамика":   "thermodynamics",
		"электродинамика": "electrodynamics",
		"оптика":         "optics",
		"квантовая":      "quantum",
	}
	
	return categories[strings.ToLower(topic)]
}

// Получение количества баллов по сложности
func getPointsByDifficulty(difficulty string) int {
	points := map[string]int{
		"beginner":    1,
		"intermediate": 2,
		"advanced":    3,
	}
	
	return points[difficulty]
}

// Получение времени на решение по сложности
func getTimeLimitByDifficulty(difficulty string) int {
	timeLimits := map[string]int{
		"beginner":    15,
		"intermediate": 20,
		"advanced":    25,
	}
	
	return timeLimits[difficulty]
}

// Endpoint для получения заданий
func getTasksHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	
	// Получаем параметры фильтрации
	topic := r.URL.Query().Get("topic")
	difficulty := r.URL.Query().Get("difficulty")
	limit := r.URL.Query().Get("limit")
	
	// Загружаем базу данных
	db, err := loadTasksDatabase()
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	
	// Фильтруем задачи
	var filteredTasks []PhysicsTask
	for _, task := range db.Tasks {
		match := true
		
		if topic != "" && task.Topic != topic {
			match = false
		}
		
		if difficulty != "" && task.Difficulty != difficulty {
			match = false
		}
		
		if match {
			filteredTasks = append(filteredTasks, task)
		}
	}
	
	// Ограничиваем количество
	if limit != "" {
		if num, err := strconv.Atoi(limit); err == nil && num < len(filteredTasks) {
			filteredTasks = filteredTasks[:num]
		}
	}
	
	response := map[string]interface{}{
		"success": true,
		"tasks":   filteredTasks,
		"total":   len(filteredTasks),
		"filters": map[string]string{
			"topic":      topic,
			"difficulty": difficulty,
			"limit":      limit,
		},
		"database_updated": db.Updated,
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Добавляем новый endpoint в роутинг
// (добавить в main() после других роутов)
// r.HandleFunc("/api/tasks", getTasksHandler).Methods("GET", "OPTIONS")