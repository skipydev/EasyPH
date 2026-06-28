import { beforeEach, describe, expect, it, vi } from 'vitest'
import { serverAPI } from '../utils/server'

// Мок fetch для тестов
global.fetch = vi.fn()

describe('ServerAPI', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('generateTask', () => {
		it('should generate task with valid parameters', async () => {
			const result = await serverAPI.generateTask('№1', 'Кинематика')

			expect(result).toBeDefined()
			expect(result.number).toBe('№1')
			expect(result.topic).toBe('Кинематика')
		})

		it('should throw error with invalid parameters', async () => {
			await expect(serverAPI.generateTask('', 'Кинематика')).rejects.toThrow(
				'Некорректные параметры задачи',
			)
			await expect(serverAPI.generateTask('№1', '')).rejects.toThrow(
				'Некорректные параметры задачи',
			)
		})

		it('should sanitize input parameters', async () => {
			const result = await serverAPI.generateTask(
				'<script>№1</script>',
				'<script>Кинематика</script>',
			)

			expect(result).toBeDefined()
			expect(result.number).toBe('№1')
			expect(result.topic).toBe('Кинематика')
		})
	})

	describe('checkAnswer', () => {
		it('should check answer correctly', async () => {
			const result = await serverAPI.checkAnswer('1', '100')

			expect(result).toEqual({
				isCorrect: true,
				correctAnswer: '100',
			})
		})

		it('should handle incorrect answers', async () => {
			const result = await serverAPI.checkAnswer('1', '99')

			expect(result.isCorrect).toBe(false)
			expect(result.correctAnswer).toBe('100')
		})

		it('should throw error with invalid parameters', async () => {
			await expect(serverAPI.checkAnswer('', '100')).rejects.toThrow(
				'Некорректные данные для проверки',
			)
			await expect(serverAPI.checkAnswer('1', '')).rejects.toThrow(
				'Некорректные данные для проверки',
			)
		})
	})

	describe('getTasks', () => {
		it('should get tasks with valid filters', async () => {
			const result = await serverAPI.getTasks({
				class: '10-base',
				topic: 'Кинематика',
			})

			expect(result).toBeDefined()
			expect(Array.isArray(result)).toBe(true)
		})

		it('should throw error with invalid filters', async () => {
			await expect(
				serverAPI.getTasks({ class: '', topic: 'Кинематика' }),
			).rejects.toThrow('Некорректные фильтры')
			await expect(
				serverAPI.getTasks({ class: '10-base', topic: '' }),
			).rejects.toThrow('Некорректные фильтры')
		})
	})
})
