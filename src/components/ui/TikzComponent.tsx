import { memo, useEffect, useRef, useState } from 'react'

export const TikzComponent = memo(
	({ code, problemId }: { code: string; problemId: string | number }) => {
		const containerRef = useRef<HTMLDivElement>(null)
		const [renderedCode, setRenderedCode] = useState<string | null>(null)

		useEffect(() => {
			// Если этот код уже отрисован — выходим из приема
			if (renderedCode === code) return

			const timer = setTimeout(() => {
				if (typeof (window as any).processTikz === 'function') {
					try {
						;(window as any).processTikz()
						setRenderedCode(code) // Фиксируем, что этот код мы обработали
					} catch (e) {
						console.error('TikzJax Error:', e)
					}
				}
			}, 1000) // Даем React время выставить скрипт в DOM

			return () => clearTimeout(timer)
		}, [code, renderedCode])

		return (
			<div
				key={problemId}
				className='relative my-8 w-full flex flex-col items-center'
			>
				<div
					ref={containerRef}
					className='flex justify-center p-8 bg-zinc-950/30 rounded-2xl border border-zinc-800/50 overflow-x-auto min-h-[250px] w-full'
					style={{
						filter: 'invert(1) hue-rotate(180deg) brightness(1.4)',
					}}
				>
					{/* Обертываем в key, чтобы при смене задачи скрипт пересоздавался */}
					<script type='text/tikz' key={code}>
						{code}
					</script>
				</div>
			</div>
		)
	},
)
