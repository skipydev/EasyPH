import { useEffect, useState } from 'react'
import {
	FiCheckCircle as CheckCircleIcon,
	FiChevronDown as ChevronDownIcon,
	FiCircle as CircleIcon,
	FiClock as ClockIcon,
	FiEye as EyeIcon,
	FiSettings as FlameIcon,
	FiSettings as GearIcon,
	FiTarget as TargetIcon,
	FiZap as ZapIcon,
} from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { CTAButton } from '../components/ui/CTAButton'

interface Topic {
	id: string
	title: string
	icon: React.ReactNode
	color: string
	description: string
	difficulty: 'beginner' | 'intermediate' | 'advanced'
	estimatedTime: string
	tasks: Task[]
}

interface Task {
	number: string
	description: string
	difficulty: 'easy' | 'medium' | 'hard'
	type: 'multiple' | 'numeric' | 'qualitative' | 'calculation'
}

export function EgePage() {
	const [openTopics, setOpenTopics] = useState<Set<string>>(
		new Set(['mechanics']),
	)
	const [userProgress, setUserProgress] = useState<{ [key: string]: number }>(
		{},
	)

	useEffect(() => {
		const savedProgress = localStorage.getItem('egePhysicsProgress')
		if (savedProgress) {
			try {
				const progress = JSON.parse(savedProgress)
				setUserProgress(progress)
			} catch (error) {
				console.warn('Failed to parse saved progress:', error)
				const defaultProgress = {
					mechanics: 0,
					thermodynamics: 0,
					electrodynamics: 0,
					optics: 0,
					complex: 0,
				}
				setUserProgress(defaultProgress)
				localStorage.setItem(
					'egePhysicsProgress',
					JSON.stringify(defaultProgress),
				)
			}
		} else {
			const defaultProgress = {
				mechanics: 0,
				thermodynamics: 0,
				electrodynamics: 0,
				optics: 0,
				complex: 0,
			}
			setUserProgress(defaultProgress)
			localStorage.setItem(
				'egePhysicsProgress',
				JSON.stringify(defaultProgress),
			)
		}
	}, [])

	const topics: Topic[] = [
		{
			id: 'mechanics',
			title: 'Механика',
			icon: <GearIcon className='text-3xl' />, // Увеличил иконку
			color: 'bg-zinc-700',
			description: 'Кинематика, динамика, законы сохранения',
			difficulty: 'beginner',
			estimatedTime: '15-20 мин',
			tasks: [
				{
					number: '№1',
					description: 'Кинематика',
					difficulty: 'easy',
					type: 'multiple',
				},
				{
					number: '№2',
					description: 'Динамика',
					difficulty: 'easy',
					type: 'multiple',
				},
				{
					number: '№3',
					description: 'Законы сохранения',
					difficulty: 'medium',
					type: 'multiple',
				},
				{
					number: '№4',
					description: 'Статика и гидростатика',
					difficulty: 'medium',
					type: 'multiple',
				},
				{
					number: '№5',
					description: 'Механические колебания и волны',
					difficulty: 'medium',
					type: 'multiple',
				},
				{
					number: '№21',
					description: 'Качественная задача',
					difficulty: 'easy',
					type: 'qualitative',
				},
				{
					number: '№22',
					description: 'Расчётная задача',
					difficulty: 'hard',
					type: 'calculation',
				},
				{
					number: '№23',
					description: 'Расчётная задача (механика + волны)',
					difficulty: 'hard',
					type: 'calculation',
				},
			],
		},
		{
			id: 'thermodynamics',
			title: 'Молекулярная физика и термодинамика',
			icon: <FlameIcon className='text-3xl' />,
			color: 'bg-zinc-700',
			description: 'МКТ, уравнение состояния, тепловые процессы',
			difficulty: 'intermediate',
			estimatedTime: '12-18 мин',
			tasks: [
				{
					number: '№6',
					description: 'МКТ и уравнение состояния',
					difficulty: 'easy',
					type: 'multiple',
				},
				{
					number: '№7',
					description: 'Изопроцессы',
					difficulty: 'medium',
					type: 'multiple',
				},
				{
					number: '№8',
					description: 'Влажность и тепловые явления',
					difficulty: 'medium',
					type: 'multiple',
				},
				{
					number: '№9',
					description: 'Тепловые машины и КПД',
					difficulty: 'hard',
					type: 'multiple',
				},
				{
					number: '№10',
					description: 'Установление соответствия',
					difficulty: 'medium',
					type: 'multiple',
				},
			],
		},
		{
			id: 'electrodynamics',
			title: 'Электродинамика',
			icon: <ZapIcon className='text-3xl' />,
			color: 'bg-zinc-700',
			description: 'Электростатика, ток, магнитное поле, индукция',
			difficulty: 'intermediate',
			estimatedTime: '18-25 мин',
			tasks: [
				{
					number: '№11',
					description: 'Электростатика',
					difficulty: 'medium',
					type: 'multiple',
				},
				{
					number: '№12',
					description: 'Постоянный ток',
					difficulty: 'medium',
					type: 'multiple',
				},
				{
					number: '№13',
					description: 'Магнитное поле',
					difficulty: 'medium',
					type: 'multiple',
				},
				{
					number: '№18',
					description: 'Электромагнитная индукция',
					difficulty: 'hard',
					type: 'multiple',
				},
				{
					number: '№19',
					description: 'Показания приборов',
					difficulty: 'hard',
					type: 'calculation',
				},
				{
					number: '№20',
					description: 'Планирование эксперимента',
					difficulty: 'hard',
					type: 'qualitative',
				},
			],
		},
		{
			id: 'optics',
			title: 'Оптика и квантовая физика',
			icon: <EyeIcon className='text-3xl' />,
			color: 'bg-zinc-700',
			description: 'Волновая оптика, фотоэффект, геометрическая оптика',
			difficulty: 'advanced',
			estimatedTime: '15-20 мин',
			tasks: [
				{
					number: '№14',
					description: 'Волновая оптика',
					difficulty: 'hard',
					type: 'multiple',
				},
				{
					number: '№15',
					description: 'Фотоэффект',
					difficulty: 'medium',
					type: 'multiple',
				},
				{
					number: '№16',
					description: 'Геометрическая оптика',
					difficulty: 'medium',
					type: 'multiple',
				},
				{
					number: '№17',
					description: 'Атом и ядро',
					difficulty: 'medium',
					type: 'multiple',
				},
			],
		},
		{
			id: 'complex',
			title: 'Сложные расчётные задачи',
			icon: <TargetIcon className='text-3xl' />,
			color: 'bg-zinc-700',
			description: 'Комбинированные задачи повышенной сложности',
			difficulty: 'advanced',
			estimatedTime: '25-35 мин',
			tasks: [
				{
					number: '№24',
					description: 'Комбинированная (3 балла)',
					difficulty: 'hard',
					type: 'calculation',
				},
				{
					number: '№25',
					description: 'Комбинированная (3 балла)',
					difficulty: 'hard',
					type: 'calculation',
				},
				{
					number: '№26',
					description: 'Сложная с обоснованием (4 балла)',
					difficulty: 'hard',
					type: 'calculation',
				},
			],
		},
	]

	const toggleTopic = (topicId: string) => {
		const newOpenTopics = new Set(openTopics)
		if (newOpenTopics.has(topicId)) {
			newOpenTopics.delete(topicId)
		} else {
			newOpenTopics.add(topicId)
		}
		setOpenTopics(newOpenTopics)
	}

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case 'easy':
				return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
			case 'medium':
				return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
			case 'hard':
				return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
			default:
				return 'bg-zinc-800/50 text-zinc-400 border-zinc-700/30'
		}
	}

	const getTaskTypeIcon = (_type: string) => {
		return <CircleIcon className='text-[12px] text-zinc-600' />
	}

	return (
		<div className='min-h-screen bg-black text-gray-100 selection:bg-amber-500/30 bg-[radial-gradient(#1c1c1f_1px,transparent_1px)] [background-size:32px_32px]'>
			<Header />
			<main className='pt-20'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24'>
					{/* Hero Section - Scaled Up */}
					<div className='text-center mb-32'>
						<div className='inline-flex items-center px-6 py-2 bg-zinc-900/40 backdrop-blur-md rounded-full text-[13px] font-black uppercase tracking-[0.4em] text-amber-500 mb-10 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.15)]'>
							<span className='w-2.5 h-2.5 bg-amber-500 rounded-full mr-4 animate-pulse' />
							Neural training system v2.6
						</div>
						<h1 className='text-7xl md:text-[10rem] font-black tracking-tighter text-white mb-10 leading-none'>
							Подготовка <span className='text-zinc-600'>к</span> ЕГЭ
						</h1>
						<p className='text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-medium'>
							Адаптивная генерация физических моделей под ваш персональный
							уровень прогресса.
						</p>
					</div>

					<div className='grid gap-12'>
						{topics.map(topic => (
							<div
								key={topic.id}
								className={`rounded-[2rem] border transition-all duration-700 overflow-hidden ${
									openTopics.has(topic.id)
										? 'bg-zinc-900/40 border-zinc-700/60 shadow-[0_0_50px_rgba(0,0,0,0.5)]'
										: 'bg-zinc-900/10 border-zinc-800/60 hover:border-zinc-700/60'
								}`}
							>
								<button
									onClick={() => toggleTopic(topic.id)}
									className='w-full px-12 py-10 text-left flex justify-between items-center group'
									aria-expanded={openTopics.has(topic.id)}
								>
									<div className='flex items-center gap-10'>
										<div className='relative'>
											<div
												className={`w-20 h-20 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 shadow-inner`}
											>
												<div className='text-amber-500/80 group-hover:text-amber-400 transition-colors'>
													{topic.icon}
												</div>
											</div>
											{userProgress[topic.id] === 100 && (
												<div className='absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-black animate-bounce'>
													<CheckCircleIcon className='w-5 h-5 text-black' />
												</div>
											)}
										</div>
										<div>
											<div className='text-[12px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-2'>
												Module Category
											</div>
											<h3 className='text-4xl font-black text-white group-hover:text-amber-500 transition-colors tracking-tight'>
												{topic.title}
											</h3>
											<div className='flex items-center gap-8 mt-4 text-sm'>
												<span
													className={`px-4 py-1 rounded-md text-[11px] font-black uppercase tracking-widest border ${getDifficultyColor(
														topic.difficulty,
													)}`}
												>
													{topic.difficulty}
												</span>
												<span className='flex items-center gap-3 text-zinc-500 font-black uppercase text-[11px] tracking-[0.2em]'>
													<ClockIcon className='w-4 h-4' />
													{topic.estimatedTime}
												</span>
											</div>
										</div>
									</div>

									<div className='flex items-center gap-14'>
										<div className='relative w-24 h-24'>
											<svg className='w-24 h-24 -rotate-90' viewBox='0 0 64 64'>
												<circle
													cx='32'
													cy='32'
													r='28'
													stroke='#121214'
													strokeWidth='5'
													fill='none'
												/>
												<circle
													cx='32'
													cy='32'
													r='28'
													stroke='currentColor'
													strokeWidth='5'
													fill='none'
													strokeDasharray={`${2 * Math.PI * 28}`}
													strokeDashoffset={`${
														2 *
														Math.PI *
														28 *
														(1 - (userProgress[topic.id] || 0) / 100)
													}`}
													className={`transition-all duration-1000 ease-in-out ${
														userProgress[topic.id] === 100
															? 'text-emerald-500'
															: 'text-amber-600'
													}`}
													strokeLinecap='round'
												/>
											</svg>
											<div className='absolute inset-0 flex items-center justify-center flex-col'>
												<span className='text-lg font-black text-white leading-none tracking-tighter'>
													{userProgress[topic.id] || 0}%
												</span>
											</div>
										</div>
										<ChevronDownIcon
											className={`w-8 h-8 text-zinc-700 transition-transform duration-500 ${
												openTopics.has(topic.id)
													? 'rotate-180 text-amber-500'
													: ''
											}`}
										/>
									</div>
								</button>

								{openTopics.has(topic.id) && (
									<div className='px-12 pb-16 animate-fade-in'>
										<div className='h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-12' />

										<div className='mb-12 p-8 bg-amber-500/[0.03] border border-amber-500/10 rounded-2xl flex items-start gap-6'>
											<ZapIcon className='w-7 h-7 text-amber-500 mt-1 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.5)]' />
											<div>
												<div className='text-[12px] font-black uppercase tracking-widest text-amber-500 mb-2'>
													Neural Engine adaptive processing
												</div>
												<p className='text-zinc-400 text-base leading-relaxed font-medium'>
													Алгоритм анализирует вашу точность ответов и
													генерирует уникальные числовые параметры для задач
													каждого типа. Сложность подстраивается автоматически.
												</p>
											</div>
										</div>

										<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
											{topic.tasks.map(task => (
												<Link
													key={task.number}
													to={`/neyronka?num=${encodeURIComponent(
														task.number,
													)}&topic=${encodeURIComponent(task.description)}`}
													className='group relative p-8 rounded-2xl bg-zinc-950/40 border border-zinc-800/50 hover:border-amber-500/40 hover:bg-zinc-900/60 transition-all duration-300 shadow-xl'
												>
													<div className='flex items-start justify-between mb-8'>
														<div className='flex flex-col'>
															<span className='text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-2'>
																System Module
															</span>
															<span className='text-3xl font-black text-white tracking-tighter group-hover:text-amber-500 transition-colors'>
																{task.number}
															</span>
														</div>
														<span
															className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${getDifficultyColor(
																task.difficulty,
															)}`}
														>
															{task.difficulty}
														</span>
													</div>
													<p className='text-zinc-300 text-lg font-bold mb-10 leading-tight group-hover:text-white transition-colors'>
														{task.description}
													</p>
													<div className='flex items-center justify-between mt-auto pt-6 border-t border-zinc-800/50'>
														<div className='flex items-center gap-3'>
															{getTaskTypeIcon(task.type)}
															<span className='text-[10px] font-black uppercase tracking-widest text-zinc-600'>
																{task.type}
															</span>
														</div>
														<div className='flex items-center gap-2 text-amber-500/40 group-hover:text-amber-500 transition-colors'>
															<div className='w-2 h-2 bg-current rounded-full animate-pulse' />
															<span className='text-[10px] font-black uppercase tracking-[0.2em] italic'>
																AI Mode
															</span>
														</div>
													</div>
												</Link>
											))}
										</div>
									</div>
								)}
							</div>
						))}
					</div>

					{/* Bottom CTA Section */}
					<div className='mt-48 text-center'>
						<div className='inline-block w-full max-w-5xl p-1 bg-gradient-to-r from-zinc-800/0 via-zinc-800/60 to-zinc-800/0'>
							<div className='bg-black py-24 px-12 relative overflow-hidden rounded-[3rem] border border-zinc-800/30'>
								{/* Grid accent */}
								<div className='absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_center,_#f59e0b_1px,_transparent_1px)] [background-size:24px_24px]' />

								<h2 className='text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter relative z-10'>
									Готов рвать ЕГЭ <span className='text-amber-500'>2026?</span>
								</h2>
								<p className='text-zinc-400 text-xl mb-14 max-w-2xl mx-auto font-medium relative z-10 leading-relaxed'>
									Пройди калибровку системы. ИИ определит твой текущий уровень и
									сформирует индивидуальную дорожную карту обучения.
								</p>
								<CTAButton
									size='lg'
									href='/testlvl'
									className='px-20 py-7 text-base font-black uppercase tracking-[0.4em] rounded-full bg-white text-black hover:bg-amber-500 transition-all duration-500 relative z-10 shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95'
								>
									Определить уровень
								</CTAButton>
							</div>
						</div>
					</div>

					{/*{true && (
            <div className="mt-32 p-12 bg-zinc-950 border border-zinc-900 rounded-[2rem] relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-12 -translate-y-1/2 bg-black px-6 text-[11px] font-black uppercase tracking-[0.5em] text-zinc-600 border border-zinc-900">System Diagnostics</div>
              <h3 className="text-2xl font-black mb-10 text-white uppercase tracking-tighter flex items-center gap-4">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                Live Kernel Data
              </h3>
              <div className="flex flex-wrap gap-4 mb-12">
                {topics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => simulateTaskCompletion(topic.id)}
                    className="px-6 py-3 bg-zinc-900 text-zinc-400 text-[11px] font-black uppercase tracking-widest border border-zinc-800 hover:border-amber-500/60 hover:text-amber-500 transition-all active:scale-95 shadow-lg"
                  >
                    + Boost: {topic.id}
                  </button>
                ))}
                <button
                  onClick={resetAllProgress}
                  className="px-6 py-3 bg-zinc-900 text-rose-500 text-[11px] font-black uppercase tracking-widest border border-rose-900/40 hover:bg-rose-950 transition-all active:scale-95"
                >
                  Wipe Data Cache
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                 <div className="md:col-span-2">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 mb-4 flex items-center gap-3">
                        <div className="w-8 h-px bg-zinc-800" />
                        Reactive State Stream
                    </div>
                    <pre className="text-[12px] bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800 text-amber-300/60 font-mono overflow-x-auto shadow-inner leading-relaxed">
                        {JSON.stringify(userProgress, null, 2)}
                    </pre>
                 </div>
                 <div className="flex flex-col items-center justify-center border border-zinc-900 bg-zinc-900/10 rounded-2xl p-8 border-dashed">
                    <div className="text-5xl font-black text-zinc-800 mb-4 tracking-tighter">0x7F</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 text-center leading-loose">
                        Node Status: <br/> Synchronized
                    </div>
                    <div className="w-full h-1 bg-zinc-900 mt-6 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-amber-500/20" />
                    </div>
                 </div>
              </div>
            </div>
          )}*/}
				</div>
			</main>
			<Footer />
			<style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
            `}</style>
		</div>
	)
}
