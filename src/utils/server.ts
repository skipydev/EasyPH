// Безопасный серверный API для ViteJS
import type { PhysicsTask } from '../types'

const mockTasks: PhysicsTask[] = [
	{
		id: '1',
		number: '№1',
		topic: 'Кинематика',
		condition:
			'Тело движется равномерно со скоростью 20 м/с. Какое расстояние оно пройдёт за 5 секунд?',
		solution: 'S = v × t = 20 × 5 = 100 м',
		answer: '100',
		difficulty: 'beginner',
		category: 'mechanics',
	},
	{
		id: '2',
		number: '№2',
		topic: 'Динамика',
		condition:
			'Масса тела 2 кг, на него действует сила 10 Н. Найдите ускорение тела.',
		solution: 'a = F / m = 10 / 2 = 5 м/с²',
		answer: '5',
		difficulty: 'beginner',
		category: 'mechanics',
	},
]

export class ServerAPI {
	constructor() {
		// Vite environment configuration available for future use
	}

	// Безопасная генерация задачи
	async generateTask(num: string, topic: string): Promise<PhysicsTask> {
		// Валидация входных данных
		if (!num || !topic) {
			throw new Error('Некорректные параметры задачи')
		}

		// Санитизация входных данных
		const sanitizedNum = num.replace(/[<>]/g, '')
		const sanitizedTopic = topic.replace(/[<>]/g, '')

		// В реальном проекте здесь будет запрос к серверу
		// Пока используем мок-данные
		const task = mockTasks.find(
			t => t.number === sanitizedNum && t.topic === sanitizedTopic,
		)

		if (!task) {
			throw new Error('Задача не найдена')
		}

		return task
	}

	// Безопасная проверка ответа
	async checkAnswer(
		taskId: string,
		userAnswer: string,
	): Promise<{ isCorrect: boolean; correctAnswer: string }> {
		// Валидация входных данных
		if (!taskId || !userAnswer) {
			throw new Error('Некорректные данные для проверки')
		}

		// Санитизация входных данных
		const sanitizedAnswer = userAnswer.replace(/[<>]/g, '').trim()

		// Поиск задачи
		const task = mockTasks.find(t => t.id === taskId)

		if (!task) {
			throw new Error('Задача не найдена')
		}

		// Проверка ответа
		const isCorrect =
			sanitizedAnswer === task.answer ||
			Math.abs(parseFloat(sanitizedAnswer) - parseFloat(task.answer)) < 0.01

		return {
			isCorrect,
			correctAnswer: task.answer,
		}
	}

	// Получение задач по фильтрам
	async getTasks(filter: {
		class: string
		topic: string
	}): Promise<PhysicsTask[]> {
		// Валидация фильтров
		if (!filter.class || !filter.topic) {
			throw new Error('Некорректные фильтры')
		}

		// В реальном проекте здесь будет запрос к серверу с фильтрацией
		return mockTasks.filter(
			task =>
				task.category === this.mapClassToCategory(filter.class) &&
				task.topic.toLowerCase().includes(filter.topic.toLowerCase()),
		)
	}

	private mapClassToCategory(className: string): PhysicsTask['category'] {
		switch (className) {
			case '10-base':
			case '10-profile':
				return 'mechanics'
			case '11-base':
				return 'electrodynamics'
			case '11-profile':
				return 'quantum'
			default:
				return 'mechanics'
		}
	}
}

export const serverAPI = new ServerAPI()
