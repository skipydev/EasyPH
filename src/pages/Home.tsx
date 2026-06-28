import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
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
	const facts = [
		{
			title: 'ИИ-генерация задач',
			description: 'Уникальные задачи от нашей нейросети',
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

	const heroRef = useRef(null)
	const { scrollYProgress } = useScroll({
		target: heroRef,
		offset: ['start start', 'end start'],
	})

	const [daysLeft, setDaysLeft] = useState(0)
	useEffect(() => {
		const targetDate = new Date('2027-06-11T00:00:00')
		const now = new Date()
		const difference = targetDate.getTime() - now.getTime()
		const days = Math.ceil(difference / (1000 * 3600 * 24))
		setDaysLeft(days > 0 ? days : 0)
	}, [])

	return (
		<div className='min-h-screen bg-black text-gray-100 overflow-x-hidden'>
			<Header />
			<main>
				<section
					ref={heroRef}
					className='relative min-h-screen flex items-center py-20 md:py-0 overflow-hidden'
				>
					<motion.div
						className='absolute inset-0 bg-black'
						style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '50%']) }}
					/>

					<motion.div
						className='absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:60px_60px]'
						style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '80%']) }}
					/>
					<motion.div
						className='absolute inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat'
						style={{
							y: useTransform(scrollYProgress, [0, 1], ['0%', '30%']),
							backgroundImage: `url('https://naukatv.ru/upload/images/original/7a/7ac9924c7ef7920b189af9a2b97cee828ea2a41a.jpg')`,
							opacity: 0.2,
						}}
					/>

					<motion.div
						className='relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full'
						style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '-20%']) }}
					>
						<div className='text-center py-16 lg:py-32'>
							<div className='inline-flex items-center gap-3 px-5 py-2.5 bg-black/40 backdrop-blur-xl rounded-full border border-emerald-500/20 mb-10'>
								<span className='w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_12px_#eab30888]' />
								<span className='text-sm font-bold uppercase tracking-wider text-white '>
									НОвая платформа
								</span>
							</div>
							<h1 className='text-6xl sm:text-7xl lg:text-9xl font-black tracking-[-0.04em] mb-6 bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent'>
								Физика
							</h1>
							<div className='text-xl md:text-2xl text-white/50  mb-8 font-bold'>
								До ЕГЭ осталось: {daysLeft} д.
							</div>
							<div className='flex flex-col sm:flex-row gap-7 justify-center mb-16'>
								<CTAButton
									size='lg'
									href='/ege'
									className='px-14 py-4 rounded-2xl bg-gradient-to-r from-orange-700 to-amber-700 hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-900/40 hover:shadow-2xl hover:shadow-orange-700/50 transform hover:scale-[1.04] transition-all duration-500'
								>
									Начать подготовку
								</CTAButton>
								<CTAButton
									variant='secondary'
									size='lg'
									href='/testlvl'
									className='px-12 py-6 rounded-2xl border-2 border-amber-400/40 text-amber-300 hover:bg-amber-950/30 hover:border-amber-400/70 backdrop-blur-sm transition-all duration-500 hover:scale-[1.04]'
								>
									Определить уровень
								</CTAButton>
							</div>
							<div className='grid grid-cols-3 gap-8 max-w-xl mx-auto text-center'>
								{[
									{ num: '150+', label: 'задач решено' },
									{ num: '25+', label: 'учеников' },
									{ num: '96%', label: 'успешных сдач' },
								].map((stat, i) => (
									<motion.div
										key={i}
										initial={{ opacity: 0, y: 30 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 1.2 + i * 0.3, duration: 0.8 }}
									>
										<div className='text-4xl font-bold text-white tracking-tight'>
											{stat.num}
										</div>
										<div className='text-sm text-gray-500 mt-1'>
											{stat.label}
										</div>
									</motion.div>
								))}
							</div>
						</div>
					</motion.div>
				</section>

				<section className='py-24 md:py-32 bg-black relative'>
					<div className='max-w-7xl mx-auto px-6 lg:px-8'>
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 1 }}
							className='text-center mb-20'
						>
							<h2 className='text-5xl lg:text-6xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6'>
								Почему выбирают нас
							</h2>
							<p className='text-xl text-gray-400 max-w-3xl mx-auto'>
								ИИ + современный подход = результат на ЕГЭ
							</p>
						</motion.div>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
							{facts.map((fact, i) => (
								<AnimatedFact key={i} {...fact} delay={i * 150} />
							))}
						</div>
					</div>
				</section>

				<section className='py-24 md:py-32 bg-gradient-to-b from-black to-orange-950/30 relative overflow-hidden'>
					<div className='absolute inset-0 opacity-[0.07]'>
						<div className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px]' />
					</div>
					<div className='max-w-5xl mx-auto px-6 lg:px-8 text-center relative z-10'>
						<motion.h2
							initial={{ opacity: 0, scale: 0.95 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							className='text-5xl lg:text-7xl font-black bg-gradient-to-br from-white to-amber-300 bg-clip-text text-transparent mb-8'
						>
							Готов сдать на 80+?
						</motion.h2>
						<p className='text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto'>
							Тысячи ребят уже закрыли ЕГЭ без репетиторов. Твой результат
							следующий.
						</p>
						<div className='flex flex-col sm:flex-row gap-6 justify-center mb-16'>
							<CTAButton
								size='lg'
								href='/ege'
								className='px-16 py-7 text-xl rounded-3xl bg-gradient-to-r from-orange-700 to-amber-700 hover:from-orange-600 hover:via-amber-600 hover:to-orange-600 shadow-2xl shadow-orange-900/50 hover:shadow-orange-700/70 transform hover:scale-105 transition-all duration-500'
							>
								Начать сейчас
							</CTAButton>
							<CTAButton
								variant='secondary'
								size='lg'
								href='/testlvl'
								className='px-16 py-7 text-xl rounded-3xl border-2 border-amber-400/60 text-amber-300 hover:bg-amber-950/40 hover:border-amber-300 transition-all duration-500 hover:scale-105'
							>
								Проверить уровень
							</CTAButton>
						</div>
						<div className='flex flex-wrap justify-center gap-8 text-gray-400 text-base'>
							{[
								'Бесплатно навсегда',
								'Без регистрации',
								'Мгновенный старт',
							].map((item, i) => (
								<div key={i} className='flex items-center gap-3'>
									<div className='w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_10px_#eab30866]' />
									<span>{item}</span>
								</div>
							))}
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	)
}
