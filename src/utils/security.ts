// Утилитарные функции для работы с DOM
export function createElement(tag: string, className?: string): HTMLElement {
	const element = document.createElement(tag)
	if (className) {
		element.className = className
	}
	return element
}

export function setTextContent(element: HTMLElement, text: string): void {
	element.textContent = text
}

export function isValidURL(url: string): boolean {
	try {
		const urlObj = new URL(url)
		return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
	} catch {
		return false
	}
}

export function generateId(prefix: string = 'id'): string {
	return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}
