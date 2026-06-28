import { describe, expect, it } from 'vitest'
import {
	sanitizeInput,
	validateFractionAnswer,
	validateNumericAnswer,
} from '../utils/validation'

describe('Validation Utils', () => {
	describe('validateNumericAnswer', () => {
		it('should validate correct numeric answers', () => {
			expect(validateNumericAnswer('100', '100')).toBe(true)
			expect(validateNumericAnswer('5.5', '5.5')).toBe(true)
			expect(validateNumericAnswer('10,5', '10.5')).toBe(true)
		})

		it('should validate with small tolerance', () => {
			expect(validateNumericAnswer('100.01', '100')).toBe(true)
			expect(validateNumericAnswer('99.99', '100')).toBe(true)
		})

		it('should reject incorrect answers', () => {
			expect(validateNumericAnswer('99', '100')).toBe(false)
			expect(validateNumericAnswer('abc', '100')).toBe(false)
		})
	})

	describe('validateFractionAnswer', () => {
		it('should validate fraction answers', () => {
			expect(validateFractionAnswer('1/2', '0.5')).toBe(true)
			expect(validateFractionAnswer('3/4', '0.75')).toBe(true)
		})

		it('should fallback to numeric validation', () => {
			expect(validateFractionAnswer('100', '100')).toBe(true)
		})
	})

	describe('sanitizeInput', () => {
		it('should remove dangerous characters', () => {
			expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
				'scriptalert("xss")/script'
			)
			expect(sanitizeInput('  hello  world  ')).toBe('hello world')
		})
	})
})
