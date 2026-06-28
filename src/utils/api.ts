import type { ApiResponse, PhysicsTask } from '../types'

class ApiService {
	private readonly baseUrl: string
	private readonly timeout = 30000

	constructor() {
		this.baseUrl = (import.meta as any).env.PROD
			? window.location.origin + '/api'
			: 'http://localhost:5000'
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {},
	): Promise<ApiResponse<T>> {
		try {
			const url = `${this.baseUrl}${endpoint}`

			const headers = {
				'Content-Type': 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				...options.headers,
			}

			const controller = new AbortController()
			const timeoutId = setTimeout(() => controller.abort(), this.timeout)

			const response = await fetch(url, {
				...options,
				headers,
				signal: controller.signal,
			})

			clearTimeout(timeoutId)

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}))
				throw new Error(
					errorData.error || `HTTP error! status: ${response.status}`,
				)
			}

			const data = await response.json()
			return { success: true, data }
		} catch (error) {
			console.error('API Error:', error)
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}

	async generateTask(
		num: string,
		topic: string,
		_userId: string = 'default-user',
	): Promise<ApiResponse<PhysicsTask>> {
		const result = await this.request('/generate', {
			method: 'POST',
			body: JSON.stringify({
				num: num,
				topic: topic,
			}),
		})

		if (result.success && result.data) {
			// Преобразуем ответ DeepSeek в PhysicsTask формат
			const taskData = result.data as any
			const transformedTask: PhysicsTask = {
				id: `task_${Date.now()}`,
				number: num,
				topic: topic,
				condition: taskData.condition || 'Условие не найдено',
				solution: taskData.solution || 'Решение отсутствует',
				answer: taskData.answer || '',
				difficulty: 'intermediate' as const,
				category: 'mechanics' as const,
			}
			return { success: true, data: transformedTask }
		}

		return {
			success: false,
			error: result.error || 'Не удалось сгенерировать задачу',
		}
	}

	// Проверка ответа с помощью DeepSeek
	async validateAnswer(
		_taskId: string,
		userAnswer: string,
		correctAnswer: string,
		_userId: string = 'default-user',
	): Promise<
		ApiResponse<{
			isCorrect: boolean
			correctAnswer: string
			explanation: string
			feedback: string
			pointsEarned: number
		}>
	> {
		const result = await this.request('/check', {
			method: 'POST',
			body: JSON.stringify({
				correct: correctAnswer,
				user: userAnswer,
			}),
		})

		if (result.success && result.data) {
			// Преобразуем ответ DeepSeek в стандартный формат
			const checkData = result.data as any
			const isCorrect = checkData.status === 'correct'
			return {
				success: true,
				data: {
					isCorrect: isCorrect,
					correctAnswer: correctAnswer,
					explanation: isCorrect ? 'Ответ правильный!' : 'Ответ неправильный.',
					feedback:
						checkData.result ||
						(isCorrect ? 'Отлично! 🎉' : 'Попробуйте еще раз.'),
					pointsEarned: isCorrect ? 2 : 0,
				},
			}
		}

		return {
			success: false,
			error: result.error || 'Проверка ответа не удалась',
		}
	}

	// Получение прогресса пользователя (mock для DeepSeek)
	async getUserProgress(_userId: string = 'default-user'): Promise<
		ApiResponse<{
			userId: string
			overallProgress: number
			topicProgress: Record<string, number>
			tasksCompleted: number
			accuracyRate: number
			level: string
			streak: number
			lastActivity: string
		}>
	> {
		// Mock данные для обратной совместимости
		return Promise.resolve({
			success: true,
			data: {
				userId: _userId,
				overallProgress: 65,
				topicProgress: {
					mechanics: 80,
					thermodynamics: 45,
					electrodynamics: 60,
					optics: 30,
					quantum: 10,
				},
				tasksCompleted: 15,
				accuracyRate: 0.75,
				level: 'intermediate',
				streak: 5,
				lastActivity: new Date().toISOString(),
			},
		})
	}

	// Обновление прогресса пользователя (mock для DeepSeek)
	async updateUserProgress(
		_userId: string = 'default-user',
		_progress: any,
	): Promise<ApiResponse<{ success: boolean; message: string }>> {
		// Mock успешное обновление для обратной совместимости
		return Promise.resolve({
			success: true,
			data: { success: true, message: 'Progress updated successfully' },
		})
	}

	// Получение задач из базы данных
	async getTasksFromDatabase(
		topic: string = '',
		difficulty: string = '',
		limit: number = 10,
	): Promise<ApiResponse<PhysicsTask[]>> {
		const params = new URLSearchParams()
		if (topic) params.append('topic', topic)
		if (difficulty) params.append('difficulty', difficulty)
		if (limit) params.append('limit', limit.toString())

		const result = await this.request(`/api/tasks?${params.toString()}`, {
			method: 'GET',
		})

		if (result.success && result.data) {
			// Преобразуем ответ сервера в массив задач
			const responseData = result.data as any
			return {
				success: true,
				data: responseData.tasks || [],
			}
		}

		return {
			success: false,
			error: (result as any).error || 'Не удалось получить задачи',
		}
	}

	// Начало тестирования уровня (использует предсгенерированные задачи)
	async startLevelTest(
		_userId: string = 'default-user',
		testType: string = 'comprehensive',
		topicFilter: string = '',
	): Promise<
		ApiResponse<{
			testId: string
			tasks: PhysicsTask[]
			timeLimit: number
		}>
	> {
		// Сначала получаем задачи из базы данных
		const tasksResponse = await this.getTasksFromDatabase(
			topicFilter,
			testType,
			10,
		)

		if (tasksResponse.success && tasksResponse.data) {
			return {
				success: true,
				data: {
					testId: `test_${Date.now()}`,
					tasks: tasksResponse.data,
					timeLimit: 30,
				},
			}
		}

		// Fallback на mock данные при ошибке
		return {
			success: false,
			error: tasksResponse.error || 'Не удалось получить задачи',
		}
	}

	// Отправка результатов тестирования уровня (mock для DeepSeek)
	async submitLevelTest(
		_testId: string,
		_userId: string = 'default-user',
		_answers: Array<{
			taskId: string
			userAnswer: string
			timeSpent: number
		}>,
		_timeSpent: number,
	): Promise<
		ApiResponse<{
			score: number
			maxScore: number
			percentage: number
			level: string
			recommendations: string[]
			weakTopics: string[]
			strongTopics: string[]
		}>
	> {
		// Mock результат для обратной совместимости
		return Promise.resolve({
			success: true,
			data: {
				score: 15,
				maxScore: 20,
				percentage: 75,
				level: 'intermediate',
				recommendations: [
					'Продолжайте изучение механики',
					'Повторите термодинамику',
				],
				weakTopics: ['термодинамика'],
				strongTopics: ['механика'],
			},
		})
	}

	// Проверка здоровья сервера
	async healthCheck(): Promise<
		ApiResponse<{
			status: string
			service: string
			ai: string
		}>
	> {
		return this.request('/health', {
			method: 'GET',
		})
	}

	// Legacy методы для обратной совместимости
	async getTasks(filter: {
		class: string
		topic: string
	}): Promise<ApiResponse<PhysicsTask[]>> {
		// Используем генерацию задач вместо получения готовых
		const result = await this.generateTask('№1', filter.topic)
		if (result.success && result.data) {
			return {
				success: true,
				data: [result.data],
			}
		}
		return {
			success: false,
			error: result.error || 'Failed to generate task',
		}
	}

	async checkAnswer(
		taskId: string,
		answer: string,
		correctAnswer: string = '',
	): Promise<ApiResponse<{ isCorrect: boolean; correctAnswer: string }>> {
		const validation = await this.validateAnswer(taskId, answer, correctAnswer)

		if (validation.success && validation.data) {
			return {
				success: true,
				data: {
					isCorrect: validation.data.isCorrect,
					correctAnswer: validation.data.correctAnswer,
				},
			}
		}

		return {
			success: false,
			error: validation.error || 'Validation failed',
		}
	}
}

export const apiService = new ApiService()
