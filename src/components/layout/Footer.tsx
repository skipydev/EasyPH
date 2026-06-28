import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'

export function Footer() {
	const { scrollYProgress } = useScroll()

	// Параллакс: фон двигается медленнее, чем скролл
	const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

	return (
		<footer className='relative bg-black border-t border-zinc-900/50 py-12 mt-auto overflow-hidden'>
			<motion.div
				className='absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black opacity-80'
				style={{ y: bgY }}
			/>
			<div className='absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:40px_40px]' />

			<div className='relative max-w-7xl mx-auto px-6 lg:px-8 z-10'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-10'>
					{/* Левый блок */}
					<div className='md:col-span-2'>
						<h3 className='text-2xl font-bold text-white mb-4'>EasyФизика</h3>
						<p className='text-zinc-400 leading-relaxed max-w-md text-sm'>
							Платформа для подготовки к ЕГЭ по физике с использованием ИИ.
						</p>
					</div>

					{/* Навигация */}
					<div>
						<h4 className='text-sm font-semibold text-zinc-300 mb-5 uppercase tracking-wider'>
							Навигация
						</h4>
						<ul className='space-y-3 text-sm'>
							<li>
								<Link
									to='/'
									className='text-zinc-500 hover:text-zinc-200 transition-colors'
								>
									Главная
								</Link>
							</li>
							<li>
								<Link
									to='/ege'
									className='text-zinc-500 hover:text-zinc-200 transition-colors'
								>
									Подготовка к ЕГЭ
								</Link>
							</li>
							<li>
								<Link
									to='/bank'
									className='text-zinc-500 hover:text-zinc-200 transition-colors'
								>
									Банк знаний
								</Link>
							</li>
							<li>
								<Link
									to='/testlvl'
									className='text-zinc-500 hover:text-zinc-200 transition-colors'
								>
									Определение уровня
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className='text-sm font-semibold text-zinc-300 mb-5 uppercase tracking-wider'>
							О платформе
						</h4>
						<ul className='space-y-3 text-sm'>
							<li>
								<Link
									to='/about'
									className='text-zinc-500 hover:text-zinc-200 transition-colors'
								>
									О нас
								</Link>
							</li>
							<li>
								<Link
									to='/neyronka'
									className='text-zinc-500 hover:text-zinc-200 transition-colors'
								>
									Нейросеть
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className='border-t border-zinc-900/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500'>
					<p>© 2025 EasyФизика.</p>
					<p className='mt-4 md:mt-0'></p>
				</div>
			</div>
		</footer>
	)
}
