import { useState } from 'react'
import {
	FiBarChart2 as ChartIcon,
	FiCpu as CpuIcon,
	FiTarget as TargetIcon,
} from 'react-icons/fi'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { CTAButton } from '../components/ui/CTAButton'

interface Task {
	id: string
	condition: string
	solution: string
	answer: string
}

export function TestLevelPage() {
	const [currentTask, setCurrentTask] = useState(0)
	const [correctCount, setCorrectCount] = useState(0)
	const [answerSubmitted, setAnswerSubmitted] = useState(false)
	const [userAnswer, setUserAnswer] = useState('')
	const [showSolution, setShowSolution] = useState(false)
	const [showResults, setShowResults] = useState(false)
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

	const tasks: Task[] = [
		{
			id: '1',
			condition:
				'Тело движется равномерно со скоростью 20 м/с. Какое расстояние оно пройдёт за 5 секунд?',
			solution: 'S = v × t = 20 × 5 = 100 м',
			answer: '100',
		},
		{
			id: '2',
			condition:
				'Масса тела 2 кг, на него действует сила 10 Н. Найдите ускорение тела.',
			solution: 'a = F / m = 10 / 2 = 5 м/с²',
			answer: '5',
		},
		{
			id: '3',
			condition:
				'Два тела массами 1 кг и 3 кг движутся навстречу друг другу со скоростями 4 м/с и 2 м/с соответственно. После абсолютно неупругого столкновения скорость системы равна...',
			solution:
				'm1v1 - m2v2 = (m1+m2)v → 1·4 - 3·2 = 4v → v = 0.5 м/с (в сторону первого)',
			answer: '0.5',
		},
		{
			id: '4',
			condition:
				'Средняя квадратичная скорость молекул кислорода при 27°C равна 500 м/с. Какова она при 127°C?',
			solution: 'v ~ √T → v2 = 500 × √(400/300) ≈ 577 м/с',
			answer: '577',
		},
		{
			id: '5',
			condition:
				'Идеальный газ получил 300 Дж тепла и совершил работу 100 Дж. Изменение внутренней энергии равно...',
			solution: 'ΔU = Q - A = 300 - 100 = 200 Дж',
			answer: '200',
		},
		{
			id: '6',
			condition:
				'Два точечных заряда 2 нКл и -8 нКл находятся на расстоянии 0.1 м. Сила взаимодействия равна...',
			solution: 'F = k |q1 q2| / r² = 9×10^9 × 16×10^-18 / 0.01 = 0.0144 Н',
			answer: '0.0144',
		},
		{
			id: '7',
			condition:
				'Сопротивление участка цепи 10 Ом, сила тока 2 А. Напряжение на участке равно...',
			solution: 'U = I R = 2 × 10 = 20 В',
			answer: '20',
		},
		{
			id: '8',
			condition:
				'Проводник длиной 0.5 м с током 10 А находится в магнитном поле 0.4 Тл перпендикулярно линиям индукции. Сила Ампера равна...',
			solution: 'F = I L B = 10 × 0.5 × 0.4 = 2 Н',
			answer: '2',
		},
		{
			id: '9',
			condition:
				'Фокусное расстояние собирающей линзы 20 см. Предмет находится на расстоянии 30 см от линзы. Где изображение?',
			solution:
				'1/F = 1/d + 1/f → 1/f = 1/20 - 1/30 = 1/60 → f = 60 см (действительное)',
			answer: '60',
		},
		{
			id: '10',
			condition:
				'Длина волны света 600 нм. Расстояние между щелями в опыте Юнга 0.1 мм, расстояние до экрана 1 м. Расстояние между центральным и первым максимумом равно...',
			solution: 'Δx = λ L / d = 600×10^-9 × 1 / 0.1×10^-3 = 0.006 м = 6 мм',
			answer: '0.006',
		},
		{
			id: '11',
			condition:
				'Работа выхода электрона 2 эВ. Красная граница фотоэффекта соответствует длине волны...',
			solution: 'λ = 1240 / A (в эВ·нм) → λ = 1240 / 2 = 620 нм',
			answer: '620',
		},
		{
			id: '12',
			condition:
				'При альфа-распаде ядро теряет 2 протона и 2 нейтрона. Как изменится массовое число?',
			solution: 'Массовое число уменьшается на 4',
			answer: '4',
		},
	]

	const normalizeAnswer = (answer: string): string => {
		return answer.trim().replace(/,/g, '.').replace(/\s/g, '').toLowerCase()
	}

	const checkAnswer = () => {
		if (!userAnswer.trim()) return

		const user = normalizeAnswer(userAnswer)
		const correct = normalizeAnswer(tasks[currentTask]?.answer ?? '')
		const isCorrectAnswer =
			user === correct ||
			(!isNaN(parseFloat(user)) &&
				!isNaN(parseFloat(correct)) &&
				Math.abs(parseFloat(user) - parseFloat(correct)) < 0.1)

		setIsCorrect(isCorrectAnswer)
		setAnswerSubmitted(true)

		if (isCorrectAnswer) {
			setCorrectCount(prev => prev + 1)
		}
	}

	const nextTask = () => {
		if (currentTask === tasks.length - 1) {
			setShowResults(true)
		} else {
			setCurrentTask(prev => prev + 1)
			setAnswerSubmitted(false)
			setUserAnswer('')
			setShowSolution(false)
			setIsCorrect(null)
		}
	}

	const showFinalResults = () => {
		let level, recommendations
		if (correctCount <= 4) {
			level = 'Новичок'
			recommendations =
				'Стоит начать с базовых разделов: кинематика, динамика и законы сохранения.'
		} else if (correctCount <= 8) {
			level = 'Средний уровень'
			recommendations =
				'Хорошая база. Фокусируйся на профильных темах 11 класса и комбинированных задачах.'
		} else {
			level = 'Продвинутый'
			recommendations =
				'Отличная подготовка. Можешь смело переходить к решению задач уровня 80+ баллов.'
		}

		const resultData = {
			score: correctCount,
			level:
				correctCount <= 4
					? 'beginner'
					: correctCount <= 8
					? 'intermediate'
					: 'advanced',
			date: new Date().toISOString(),
		}
		localStorage.setItem('physicsLevel', JSON.stringify(resultData))

		return { level, recommendations }
	}

	if (showResults) {
		const { level, recommendations } = showFinalResults()
		return (
			<div className='min-h-screen bg-black text-gray-100 selection:bg-amber-500/30 bg-[radial-gradient(#1c1c1f_1px,transparent_1px)] [background-size:32px_32px]'>
				<Header />
				<main className='pt-32 pb-20'>
					<div className='max-w-4xl mx-auto px-4'>
						<div className='text-center'>
							<div className='inline-block bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/60 rounded-[3rem] p-12 md:p-24 shadow-2xl relative overflow-hidden'>
								{/* Фоновая сетка */}
								<div className='absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_center,_#f59e0b_1px,_transparent_1px)] [background-size:20px_20px]' />

								<div className='relative z-10'>
									<div className='text-[12px] font-black uppercase tracking-[0.5em] text-amber-500 mb-10 opacity-80'>
										Калибровка завершена
									</div>
									<h2 className='text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter'>
										Результат
									</h2>

									<div className='flex flex-col items-center gap-4 mb-12'>
										<div className='text-8xl md:text-[10rem] font-black text-amber-500 leading-none tracking-tighter'>
											{correctCount}
											<span className='text-zinc-700'>/</span>12
										</div>
										<div className='px-6 py-2 bg-zinc-950 border border-zinc-800 rounded-full text-xs font-black uppercase tracking-[0.3em] text-zinc-400'>
											Индекс точности: {Math.round((correctCount / 12) * 100)}%
										</div>
									</div>

									<div className='text-3xl md:text-5xl font-black text-white mb-8 tracking-tight uppercase'>
										{level}
									</div>

									<p className='text-lg md:text-xl text-zinc-400 mb-16 max-w-xl mx-auto leading-relaxed font-medium'>
										{recommendations}
									</p>

									<div className='flex flex-col sm:flex-row gap-6 justify-center'>
										<CTAButton
											href='/ege'
											className='px-14 py-6 rounded-full bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-amber-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all duration-500 hover:scale-105'
										>
											Начать подготовку
										</CTAButton>
										<CTAButton
											href='/bank'
											className='px-14 py-6 rounded-full bg-zinc-900 text-zinc-300 font-black uppercase tracking-widest text-sm border border-zinc-800 hover:bg-zinc-800 transition-all'
										>
											Учебный банк
										</CTAButton>
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
				<Footer />
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-black text-gray-100 selection:bg-amber-500/30 bg-[radial-gradient(#1c1c1f_1px,transparent_1px)] [background-size:32px_32px]'>
			<Header />

			<main className='pt-24 pb-20'>
				<div className='max-w-4xl mx-auto px-4'>
					<div className='text-center mb-16'>
						<div className='inline-flex items-center gap-4 px-6 py-2 bg-zinc-900/50 backdrop-blur-md rounded-full border border-zinc-800/50 mb-8 shadow-sm'>
							<CpuIcon className='w-4 h-4 text-amber-500 animate-pulse' />
							<span className='text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500'>
								Режим калибровки системы
							</span>
						</div>
						<h1 className='text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase'>
							Тест уровня
						</h1>

						{/* Индикатор этапов */}
						<div className='flex items-center justify-center gap-3'>
							{tasks.map((_, i) => (
								<div
									key={i}
									className={`h-1.5 transition-all duration-500 rounded-full ${
										i === currentTask
											? 'w-8 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
											: i < currentTask
											? 'w-4 bg-zinc-700'
											: 'w-2 bg-zinc-900'
									}`}
								/>
							))}
						</div>
					</div>

					<div className='bg-zinc-900/30 backdrop-blur-2xl rounded-[2.5rem] border border-zinc-800/60 shadow-2xl overflow-hidden animate-fade-in'>
						{/* Модуль условия */}
						<div className='p-8 md:p-14 border-b border-zinc-800/50'>
							<div className='flex items-center justify-between mb-8'>
								<h2 className='text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600'>
									Модуль условия
								</h2>
								<span className='text-[10px] font-black uppercase tracking-widest text-amber-500/50'>
									Этап {currentTask + 1} из 12
								</span>
							</div>

							<div className='bg-zinc-950/80 rounded-2xl p-8 md:p-12 border border-zinc-800/40 shadow-inner relative group'>
								<div className='absolute top-4 left-4 w-2 h-2 border-t border-l border-zinc-800' />
								<div className='absolute top-4 right-4 w-2 h-2 border-t border-r border-zinc-800' />
								<div className='absolute bottom-4 left-4 w-2 h-2 border-b border-l border-zinc-800' />
								<div className='absolute bottom-4 right-4 w-2 h-2 border-b border-r border-zinc-800' />

								<p className='text-xl md:text-3xl font-bold text-zinc-100 leading-tight tracking-tight'>
									{tasks[currentTask]?.condition ?? ''}
								</p>
							</div>
						</div>

						{/* Модуль ввода */}
						<div className='p-8 md:p-14 bg-zinc-900/20'>
							<div className='mb-10'>
								<label className='block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4'>
									Ввод данных
								</label>
								<input
									type='text'
									value={userAnswer}
									onChange={e => setUserAnswer(e.target.value)}
									disabled={answerSubmitted}
									autoFocus
									className={`w-full px-8 py-6 bg-black border-2 rounded-2xl text-2xl font-black text-white placeholder-zinc-900 focus:outline-none transition-all duration-300 ${
										isCorrect === false
											? 'border-red-600 bg-red-500/5 animate-shake'
											: isCorrect === true
											? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400'
											: 'border-zinc-800 focus:border-amber-500/50'
									}`}
									placeholder='РЕЗУЛЬТАТ...'
								/>
							</div>

							{isCorrect !== null && (
								<div
									className={`mb-10 p-6 rounded-2xl border flex items-center justify-center gap-4 animate-slide-up ${
										isCorrect
											? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
											: 'bg-red-500/10 border-red-500/20 text-red-400'
									}`}
								>
									<div
										className={`w-2 h-2 rounded-full animate-pulse ${
											isCorrect ? 'bg-emerald-500' : 'bg-red-500'
										}`}
									/>
									<span className='text-[11px] font-black uppercase tracking-[0.3em]'>
										{isCorrect
											? 'Валидация пройдена'
											: `Ошибка валидации (верно: ${tasks[currentTask]?.answer})`}
									</span>
								</div>
							)}

							{/* Действия */}
							<div className='flex flex-col sm:flex-row gap-4'>
								{!answerSubmitted ? (
									<button
										onClick={checkAnswer}
										disabled={!userAnswer.trim()}
										className={`flex-1 px-10 py-6 rounded-full font-black uppercase tracking-widest text-xs transition-all duration-300 ${
											!userAnswer.trim()
												? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
												: 'bg-amber-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:bg-amber-400 active:scale-95'
										}`}
									>
										Проверить ответ
									</button>
								) : (
									<button
										onClick={nextTask}
										className='flex-1 px-10 py-6 rounded-full bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all duration-300 shadow-xl'
									>
										{currentTask === tasks.length - 1
											? 'Завершить калибровку'
											: 'Следующий модуль'}
									</button>
								)}

								{isCorrect === false && (
									<button
										onClick={() => setShowSolution(!showSolution)}
										className='px-10 py-6 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-xs hover:text-white transition-all active:scale-95'
									>
										{showSolution ? 'Скрыть алгоритм' : 'Показать алгоритм'}
									</button>
								)}
							</div>

							{/* Модуль решения */}
							{showSolution && (
								<div className='mt-10 p-8 bg-zinc-950/60 rounded-2xl border border-zinc-800/50 animate-fade-in relative'>
									<div className='text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 mb-6'>
										Алгоритм решения
									</div>
									<p className='text-zinc-400 text-lg leading-relaxed font-medium'>
										{tasks[currentTask]?.solution ?? ''}
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Технический подвал */}
					<div className='mt-8 flex justify-between items-center px-4'>
						<div className='flex items-center gap-2'>
							<TargetIcon className='w-4 h-4 text-zinc-700' />
							<span className='text-[10px] font-black uppercase tracking-widest text-zinc-700 opacity-60'>
								Система оценки активна
							</span>
						</div>
						<div className='flex items-center gap-2'>
							<ChartIcon className='w-4 h-4 text-zinc-700' />
							<span className='text-[10px] font-black uppercase tracking-widest text-zinc-700 opacity-60'>
								Верных ответов: {correctCount}
							</span>
						</div>
					</div>
				</div>
			</main>

			<Footer />

			<style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slideUp 0.3s ease-out forwards; }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
		</div>
	)
}
