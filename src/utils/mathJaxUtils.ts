interface TextElement {
	type: 'text' | 'inline-math' | 'block-math'
	content: string
}

export function parseMathText(text: string): TextElement[] {
	const elements: TextElement[] = []
	let lastIndex = 0

	const allMathRegex = /(\$(?:[^$]|\$\$)*?\$)/g

	let match
	while ((match = allMathRegex.exec(text)) !== null) {
		if (match.index > lastIndex) {
			const textBefore = text.slice(lastIndex, match.index)
			if (textBefore.trim()) {
				elements.push({ type: 'text', content: textBefore })
			}
		}

		const formula = match[1]
		if (formula && formula.startsWith('$') && !formula.startsWith('$$')) {
			// Inline формула
			const content = formula.slice(1, -1)
			elements.push({ type: 'inline-math', content })
		} else if (
			formula &&
			(formula.startsWith('$$') || formula.startsWith('\\['))
		) {
			const content = formula.startsWith('$$')
				? formula.slice(2, -2)
				: formula.slice(2, -2)
			elements.push({ type: 'block-math', content })
		}

		lastIndex = match.index + match[0].length
	}

	if (lastIndex < text.length) {
		const remainingText = text.slice(lastIndex)
		if (remainingText.trim()) {
			elements.push({ type: 'text', content: remainingText })
		}
	}

	return elements
}

export function stripMath(text: string): string {
	return text
		.replace(/\$(.*?)\$/g, '[формула]')
		.replace(/\$\$(.*?)\$\$/g, '[формула]')
		.replace(/\\\[(.*?)\\\]/g, '[формула]')
		.replace(/\\\((.*?)\\\)/g, '[формула]')
}

export function hasMathContent(text: string): boolean {
	return /\$(?:[^$]|\$\$)*?\$|\\\[.*?\\\]|\\\([^)]*\\\)/s.test(text)
}


export function formatTaskText(text: string): string {
	return text.replace(/\n/g, '<br />')
}
