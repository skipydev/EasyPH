import { z } from 'zod'
import { ValidationResult } from '../types'

// Схемы валидации данных
export const TaskSchema = z.object({
	id: z.string().min(1, 'ID задачи обязателен'),
	number: z.string().min(1, 'Номер задачи обязателен'),
	topic: z.string().min(1, 'Тема задачи обязательна'),
	condition: z.string().min(10, 'Условие задачи слишком короткое'),
	solution: z.string().min(10, 'Решение задачи слишком короткое'),
	answer: z.string().min(1, 'Ответ задачи обязателен'),
	difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
	category: z.enum([
		'mechanics',
		'thermodynamics',
		'electrodynamics',
		'optics',
		'quantum',
	]),
})

export const UserAnswerSchema = z.object({
	taskId: z.string(),
	answer: z.string().min(1, 'Ответ не может быть пустым'),
	timestamp: z.number(),
})

export const TaskFilterSchema = z.object({
	class: z.enum(['10-base', '10-profile', '11-base', '11-profile']),
	topic: z.string().min(1, 'Тема обязательна'),
	difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
})

// Функции валидации
export function validateTask(task: unknown): ValidationResult {
	try {
		TaskSchema.parse(task)
		return { isValid: true, errors: [] }
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				isValid: false,
				errors: error.errors.map(err => err.message),
			}
		}
		return {
			isValid: false,
			errors: ['Некорректные данные задачи'],
		}
	}
}

export function validateUserAnswer(answer: unknown): ValidationResult {
	try {
		UserAnswerSchema.parse(answer)
		return { isValid: true, errors: [] }
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				isValid: false,
				errors: error.errors.map(err => err.message),
			}
		}
		return {
			isValid: false,
			errors: ['Некорректные данные ответа'],
		}
	}
}

// Обработка пользовательского ввода
export function cleanInput(input: string): string {
	return input
		.trim()
		.replace(/[<>]/g, '') // Удаляем нежелательные символы
		.replace(/\s+/g, ' ') // Нормализуем пробелы
}

// Алиас для обратной совместимости
export const sanitizeInput = cleanInput

// Валидация числовых ответов
export function validateNumericAnswer(
	userInput: string,
	correctAnswer: string
): boolean {
	const userNum = parseFloat(userInput.replace(',', '.'))
	const correctNum = parseFloat(correctAnswer.replace(',', '.'))

	if (isNaN(userNum) || isNaN(correctNum)) {
		return false
	}

	return Math.abs(userNum - correctNum) < 0.01
}

// Валидация дробных ответов
export function validateFractionAnswer(
	userInput: string,
	correctAnswer: string
): boolean {
	const fractionRegex = /^([-+]?\d+)\/([-+]?\d+)$/
	const userMatch = userInput.match(fractionRegex)
	const correctMatch = correctAnswer.match(fractionRegex)

	if (
		userMatch &&
		correctMatch &&
		userMatch[1] &&
		userMatch[2] &&
		correctMatch[1] &&
		correctMatch[2]
	) {
		const userNum = parseInt(userMatch[1]) / parseInt(userMatch[2])
		const correctNum = parseInt(correctMatch[1]) / parseInt(correctMatch[2])
		return Math.abs(userNum - correctNum) < 0.01
	}

	return validateNumericAnswer(userInput, correctAnswer)
}
