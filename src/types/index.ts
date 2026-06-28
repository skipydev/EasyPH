// Типы для физических задач
export interface PhysicsTask {
	id: string
	number: string
	topic: string
	condition: string
	solution: string
	answer: string
	difficulty: 'beginner' | 'intermediate' | 'advanced'
	category:
		| 'mechanics'
		| 'thermodynamics'
		| 'electrodynamics'
		| 'optics'
		| 'quantum'
}

export interface TaskFilter {
	class: '10-base' | '10-profile' | '11-base' | '11-profile'
	topic: string
	difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

export interface UserProgress {
	score: number
	level: 'beginner' | 'intermediate' | 'advanced'
	completedTasks: string[]
	lastActivity: string
}

export interface ApiResponse<T> {
	success: boolean
	data?: T
	error?: string
}

// Типы для валидации
export interface ValidationResult {
	isValid: boolean
	errors: string[]
}

// Типы для UI
export interface Theme {
	primary: string
	background: string
	text: string
	accent: string
}

export type TaskStatus = 'pending' | 'correct' | 'wrong' | 'solved'
