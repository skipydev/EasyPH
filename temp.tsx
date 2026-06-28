import { useEffect, useState } from 'react'
import {
	FaBolt,
	FaBrain,
	FaBullseye,
	FaChartBar,
	FaGem,
	FaMobile,
} from 'react-icons/fa'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { AnimatedFact } from '../components/ui/AnimatedFact'
import { CTAButton } from '../components/ui/CTAButton'

export function Home() {
	const [displayText, setDisplayText] = useState('')
	const fullText = 'Физика'
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		let index = 0
		const timer = setInterval(() => {
			if (index < fullText.length) {
				setDisplayText(fullText.slice(0, index + 1))
				index++
			} else {
				clearInterval(timer)
				setIsLoaded(true)
			}
		}, 100)

		return () => clearInterval(timer)
	}, [])

	const facts = [
		{
			title: 'ИИ-генерация задач',
			icon: FaBrain,
		},
		{
			title: 'Мгновенная проверка',
			description: 'Ответы проверяются в реальном времени',
			icon: FaBolt,
		},
		{
			title: 'Персональный подход',
			description: 'Адаптация под ваш уровень знаний',
			icon: FaBullseye,
		},
		{
			title: 'Мобильная версия',
			description: 'Учитесь где удобно - дома или в дороге',
			icon: FaMobile,
		},
		{
			title: 'Статистика прогресса',
			description: 'Отслеживайте свои достижения',
			icon: FaChartBar,
		},
		{
			title: 'Бесплатно навсегда',
			description: 'Без скрытых платежей и подписок',
			icon: FaGem,
		},
	]

	const formulas = [
		{ text: 'F = ma', position: 'top-20 left-10', delay: '0s' },
		{ text: 'E = mc²', position: 'top-32 right-16', delay: '1s' },
		{ text: 'v = s/t', position: 'bottom-32 left-1/4', delay: '2s' },
		{ text: 'p = mv', position: 'top-1/2 right-1/3', delay: '3s' },
		{ text: 'F = G·m₁·m₂/r²', position: 'bottom-20 right-20', delay: '4s' },
		{ text: 'pV = nRT', position: 'top-1/3 left-1/3', delay: '5s' },
		{ text: 'hν = E', position: 'bottom-1/3 right-1/4', delay: '6s' },
		{ text: 'a = Δv/Δt', position: 'top-2/3 left-1/5', delay: '7s' },
	]

	return (
		<div className='min-h-screen bg-white'>
			<Header />

			<main>
				{/* Hero Section */}
				<section className='relative overflow-hidden bg-gradient-to-b from-slate-50 to-white'>
					{/* Physics Formulas Background */}
					<div className='absolute inset-0 overflow-hidden pointer-events-none z-0'>
						{formulas.map((formula, index) => (
							<div
								key={index}
								className={`absolute ${formula.position} opacity-20 hover:opacity-30 transition-all duration-500 animate-pulse`}
								style={{
									animationDelay: formula.delay,
									animationDuration: '3s',
								}}
							>
								<div className='text-6xl lg:text-8xl font-light text-slate-300 transform rotate-12 whitespace-nowrap select-none'>
									{formula.text}
								</div>
							</div>
						))}
					</div>

					<div className='max-w-7xl mx-auto px-6 lg:px-8 relative z-10'>
						<div className='py-24 lg:py-32'>
							<div className='text-center'>
								{/* Badge */}
								<div className='inline-flex items-center px-4 py-2 bg-slate-100 rounded-full text-sm font-medium text-slate-700 mb-8'>
									<span className='w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse'></span>
									Платформа нового поколения
								</div>

								{/* Main Title */}
								<h1 className='text-6xl lg:text-8xl font-light text-slate-900 mb-8 tracking-tight'>
									<span className='block font-extralight'>{displayText}</span>
									<span className='block text-4xl lg:text-6xl font-light text-slate-600 mt-2'>
										стала проще
									</span>
								</h1>

								{/* Subtitle */}
								<p className='text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 font-light leading-relaxed'>
									Ты просто попробуй разобраться.. Современная платформа с
									искусственным интеллектом для подготовки к ЕГЭ по физике
								</p>

								{/* CTA Buttons */}
								<div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-16'>
									<CTAButton
										size='lg'
										href='/ege'
										className='w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800'
									>
										Начать подготовку
									</CTAButton>
									<CTAButton
										variant='secondary'
										size='lg'
										href='/testlvl'
										className='w-full sm:w-auto bg-white text-slate-900 border border-slate-300 hover:bg-slate-50'
									>
										Определить уровень
									</CTAButton>
								</div>

								{/* Stats */}
								<div className='grid grid-cols-3 gap-8 max-w-2xl mx-auto'>
									<div className='text-center'>
										<div className='text-3xl font-light text-slate-900 mb-2'>
											15000+
										</div>
										<div className='text-sm text-slate-600'>задач решено</div>
									</div>
									<div className='text-center'>
										<div className='text-3xl font-light text-slate-900 mb-2'>
											2500+
										</div>
										<div className='text-sm text-slate-600'>учеников</div>
									</div>
									<div className='text-center'>
										<div className='text-3xl font-light text-slate-900 mb-2'>
											96%
										</div>
										<div className='text-sm text-slate-600'>успешных сдач</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className='py-24 bg-white'>
					<div className='max-w-7xl mx-auto px-6 lg:px-8'>
						<div className='text-center mb-16'>
							<h2 className='text-4xl lg:text-5xl font-light text-slate-900 mb-6'>
								Почему выбирают нас?
							</h2>
							<p className='text-xl text-slate-600 max-w-2xl mx-auto font-light'>
								Современные технологии делают обучение эффективным и
								увлекательным
							</p>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
							{facts.map((fact, index) => (
								<AnimatedFact
									key={index}
									title={fact.title}
									description={fact.description}
									icon={fact.icon}
									delay={index * 100}
								/>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className='py-24 bg-slate-900 relative overflow-hidden'>
					{/* Background Pattern */}
					<div className='absolute inset-0 opacity-10'>
						<div
							className='absolute inset-0'
							style={{
								backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
							}}
						></div>
					</div>

					<div className='max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10'>
						<h2 className='text-4xl lg:text-6xl font-light text-white mb-6 leading-tight'>
							Готовы начать?
						</h2>
						<p className='text-xl text-slate-300 mb-12 font-light leading-relaxed max-w-2xl mx-auto'>
							Присоединяйтесь к тысячам учеников, которые уже улучшили свои
							результаты с нашей платформой
						</p>

						<div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-12'>
							<CTAButton
								size='lg'
								href='/ege'
								className='w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 text-base font-medium'
							>
								Начать подготовку
							</CTAButton>
							<CTAButton
								variant='secondary'
								size='lg'
								href='/testlvl'
								className='w-full sm:w-auto border border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-base font-medium'
							>
								Определить уровень
							</CTAButton>
						</div>

						{/* Trust indicators */}
						<div className='flex flex-col sm:flex-row items-center justify-center gap-8 text-slate-400 text-sm'>
							<div className='flex items-center gap-2'>
								<div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
								<span>Бесплатно навсегда</span>
							</div>
							<div className='flex items-center gap-2'>
								<div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
								<span>Без регистрации</span>
							</div>
							<div className='flex items-center gap-2'>
								<div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
								<span>Мгновенный старт</span>
							</div>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	)
}
description: '?????????? ?????? ?? ????? ?????????',  
