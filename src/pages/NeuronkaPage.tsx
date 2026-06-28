import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { MathJaxComponent } from '../components/ui/MathJax'
import { TikzComponent } from '../components/ui/TikzComponent'
import { apiService } from '../utils/api'
import { formatTaskText } from '../utils/mathJaxUtils'
import {
	sanitizeInput,
	validateFractionAnswer,
	validateNumericAnswer,
} from '../utils/validation'

interface TaskData {
	condition: string
	solution: string
	answer: string
}

export function NeuronkaPage() {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const [taskData, setTaskData] = useState<TaskData | null>(null)
	const [loading, setLoading] = useState(false)
	const [userAnswer, setUserAnswer] = useState('')
	const [result, setResult] = useState<{
		isCorrect: boolean
		message: string
	} | null>(null)
	const [showSolution, setShowSolution] = useState(false)
	const [attempts, setAttempts] = useState(0)
	const [lastCheckedAnswer, setLastCheckedAnswer] = useState('')
	const [taskGenerated, setTaskGenerated] = useState(false)
	const [taskCompleted, setTaskCompleted] = useState(false)
	const [inputShake, setInputShake] = useState(false)

	const num = searchParams.get('num') || '??'
	const topic = searchParams.get('topic') || 'Физика'

	// --- ЛОГИКА (БЕЗ ИЗМЕНЕНИЙ) ---
	const getTopicProgressKey = (topicName: string): string => {
		const topicMap: { [key: string]: string } = {
			Кинематика: 'mechanics',
			Динамика: 'mechanics',
			'Законы сохранения': 'mechanics',
			'МКТ и уравнение состояния': 'thermodynamics',
			Изопроцессы: 'thermodynamics',
			Электростатика: 'electrodynamics',
			'Постоянный ток': 'electrodynamics',
			'Магнитное поле': 'electrodynamics',
			'Волновая оптика': 'optics',
			Фотоэффект: 'optics',
			'Геометрическая оптика': 'optics',
			'Атом и ядро': 'optics',
		}
		return topicMap[topicName] || 'mechanics'
	}

	const markTaskAsCompleted = () => {
		const completedTasksKey = 'completedPhysicsTasks'
		const savedTasks = localStorage.getItem(completedTasksKey)
		let completedTasks: { [key: string]: boolean } = {}
		if (savedTasks) {
			try {
				completedTasks = JSON.parse(savedTasks) || {}
			} catch (e) {}
		}
		const taskKey = `${num}_${topic}`
		completedTasks[taskKey] = true
		localStorage.setItem(completedTasksKey, JSON.stringify(completedTasks))
		setTaskCompleted(true)
		const progressKey = getTopicProgressKey(topic)
		const savedProgress = localStorage.getItem('egePhysicsProgress')
		let progress: { [key: string]: number } = {}
		if (savedProgress) {
			try {
				progress = JSON.parse(savedProgress) || {}
			} catch (e) {}
		}
		const currentProgress = progress[progressKey] || 0
		const newProgress = Math.min(100, currentProgress + 5)
		localStorage.setItem(
			'egePhysicsProgress',
			JSON.stringify({ ...progress, [progressKey]: newProgress }),
		)
	}

	const isTaskCompleted = () => {
		const savedTasks = localStorage.getItem('completedPhysicsTasks')
		if (savedTasks) {
			try {
				const completedTasks = JSON.parse(savedTasks)
				return completedTasks[`${num}_${topic}`] === true
			} catch (e) {}
		}
		return false
	}

	const getNextTask = () => {
		const taskSequence: { [key: string]: string[] } = {
			Кинематика: ['№1', '№2', '№21'],
			Динамика: ['№2', '№21', '№22'],
			'Законы сохранения': ['№3', '№22', '№23'],
			'МКТ и уравнение состояния': ['№6', '№7'],
			Изопроцессы: ['№7', '№8'],
			Электростатика: ['№11', '№12'],
			'Постоянный ток': ['№12', '№18'],
			'Магнитное поле': ['№13', '№18'],
			'Волновая оптика': ['№14', '№15'],
			Фотоэффект: ['№15', '№16'],
			'Геометрическая оптика': ['№16', '№17'],
			'Атом и ядро': ['№17', '№14'],
		}
		const tasks = taskSequence[topic] || ['№1']
		const currentIndex = tasks.indexOf(num)
		if (currentIndex === -1 || currentIndex === tasks.length - 1)
			return { num: tasks[0], topic }
		return { num: tasks[currentIndex + 1], topic }
	}

	const goToNextTask = () => {
		const nextTask = getNextTask()
		navigate(
			`/neyronka?num=${encodeURIComponent(String(nextTask.num))}&topic=${encodeURIComponent(String(nextTask.topic))}`,
		)
	}

	const generateTask = async () => {
		setLoading(true)
		setResult(null)
		setShowSolution(false)
		setUserAnswer('')
		setAttempts(0)
		setLastCheckedAnswer('')
		setTaskGenerated(true)
		setTaskCompleted(isTaskCompleted())
		try {
			const topicMap: { [key: string]: string } = {
				Кинематика: 'механика',
				Динамика: 'механика',
				'Законы сохранения': 'механика',
				'МКТ и уравнение состояния': 'термодинамика',
				Изопроцессы: 'термодинамика',
				Электростатика: 'электродинамика',
				'Постоянный ток': 'электродинамика',
				'Магнитное поле': 'электродинамика',
				'Волновая оптика': 'оптика',
				Фотоэффект: 'оптика',
				'Геометрическая оптика': 'оптика',
				'Атом и ядро': 'квантовая',
			}
			const mappedTopic = topicMap[topic] || topic.toLowerCase()
			let difficulty = 'beginner'
			if (num.includes('21') || num.includes('22') || num.includes('23'))
				difficulty = 'intermediate'
			const response = await apiService.getTasksFromDatabase(
				mappedTopic,
				difficulty,
				1,
			)
			if (response.success && response.data?.[0]) {
				setTaskData({
					condition: response.data[0].condition || '',
					solution: response.data[0].solution || '',
					answer: response.data[0].answer || '',
				})
			} else {
				const fallback = await apiService.generateTask(num, topic)
				if (fallback.success && fallback.data) setTaskData(fallback.data)
			}
		} catch (e) {
			setTaskData({ condition: 'Ошибка загрузки.', solution: '', answer: '' })
		} finally {
			setLoading(false)
		}
	}

	const checkAnswer = () => {
		if (!userAnswer.trim() || !taskData) return
		const sanitizedAnswer = sanitizeInput(userAnswer)
		if (sanitizedAnswer === lastCheckedAnswer) return
		const isCorrect =
			validateNumericAnswer(sanitizedAnswer, taskData.answer) ||
			validateFractionAnswer(sanitizedAnswer, taskData.answer)
		setResult({
			isCorrect,
			message: isCorrect ? 'ОТВЕТ ВЕРНЫЙ' : 'ОТВЕТ НЕВЕРНЫЙ',
		})
		setAttempts(prev => prev + 1)
		setLastCheckedAnswer(sanitizedAnswer)
		if (isCorrect) markTaskAsCompleted()
		else {
			setInputShake(true)
			setTimeout(() => setInputShake(false), 500)
		}
	}

	useEffect(() => {
		generateTask()
	}, [num, topic])

	// --- НОВАЯ ФУНКЦИЯ ДЛЯ ПАРСИНГА СХЕМ ---
	const renderContent = (text: string) => {
		if (!text) return null
		const tikzRegex = /(\\begin\{circuitikz\}[\s\S]*?\\end\{circuitikz\})/g
		const parts = text.split(tikzRegex)

		return parts.map((part, index) => {
			if (part.startsWith('\\begin{circuitikz}')) {
				return (
					<TikzComponent
						key={index}
						code={part}
						problemId={`${num}-${index}`}
					/>
				)
			}
			return (
				<MathJaxComponent key={index}>{formatTaskText(part)}</MathJaxComponent>
			)
		})
	}

	if (!taskGenerated) return <div className='min-h-screen bg-black' />

	return (
		<div className='min-h-screen bg-black text-gray-100 selection:bg-amber-500/30'>
			<Header />
			<main className='pt-20'>
				<div className='max-w-4xl mx-auto px-4 py-12'>
					<div className='flex flex-col md:flex-row items-center justify-between gap-6 mb-12'>
						<div>
							<div className='text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-2 text-center md:text-left'>
								Раздел физики
							</div>
							<h1 className='text-3xl font-black text-white uppercase tracking-tight text-center md:text-left'>
								{topic}
							</h1>
						</div>
						<div className='flex items-center gap-8'>
							<div className='text-center'>
								<div className='text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2'>
									Номер
								</div>
								<div className='text-2xl font-black text-white'>{num}</div>
							</div>
							{taskCompleted && (
								<div className='bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg text-emerald-500 text-xs font-black uppercase tracking-widest'>
									Зачтено
								</div>
							)}
						</div>
					</div>

					<div className='bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden'>
						{loading ? (
							<div className='py-32 text-center text-xs font-black uppercase tracking-[0.4em] text-zinc-600 animate-pulse'>
								Загрузка...
							</div>
						) : (
							<>
								<div className='p-8 md:p-12 border-b border-zinc-800/50'>
									<div className='text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-8 flex items-center gap-4'>
										Условие <div className='h-px flex-1 bg-zinc-800'></div>
									</div>
									<div className='text-zinc-200 text-lg leading-relaxed'>
										{renderContent(taskData?.condition || '')}
									</div>
								</div>

								<div className='p-8 md:p-12 bg-zinc-900/20'>
									<div className='flex items-center justify-between mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600'>
										<span>Ввод ответа</span>
										{attempts > 0 && <span>Попытка {attempts}</span>}
									</div>
									<div className='flex flex-col sm:flex-row gap-3'>
										<input
											type='text'
											value={userAnswer}
											onChange={e => {
												setUserAnswer(e.target.value)
												if (result) setResult(null)
											}}
											disabled={loading || taskCompleted}
											className={`flex-1 px-6 py-4 bg-black border rounded-xl text-white outline-none transition-all duration-300 ${inputShake ? 'animate-shake' : ''} ${taskCompleted ? 'border-emerald-500/40 bg-emerald-500/5' : result && !result.isCorrect ? 'border-red-500/40 bg-red-500/5' : 'border-zinc-800 focus:border-amber-500/50'}`}
											placeholder='Число или дробь...'
										/>
										<button
											onClick={checkAnswer}
											disabled={loading || !userAnswer.trim() || taskCompleted}
											className={`px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all ${taskCompleted ? 'bg-zinc-800 text-zinc-500' : 'bg-white text-black hover:bg-zinc-200 active:scale-95'}`}
										>
											Проверить
										</button>
									</div>
									{result && (
										<div
											className={`mt-6 text-[10px] font-black tracking-[0.2em] uppercase p-4 rounded-lg border ${result.isCorrect ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-red-400 border-red-500/20 bg-red-500/5'}`}
										>
											{result.message}
										</div>
									)}
								</div>

								<div className='px-8 py-6 bg-black/40 border-t border-zinc-800/50 flex justify-between items-center'>
									<div className='flex gap-4'>
										<button
											onClick={generateTask}
											className='text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors'
										>
											Новая задача
										</button>
										{taskCompleted && (
											<button
												onClick={goToNextTask}
												className='text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors'
											>
												Следующая →
											</button>
										)}
									</div>
									{(attempts >= 3 || taskCompleted) && (
										<button
											onClick={() => setShowSolution(!showSolution)}
											className='text-[10px] font-black uppercase tracking-widest text-amber-500 hover:text-amber-400'
										>
											{showSolution ? 'Скрыть разбор' : 'Показать разбор'}
										</button>
									)}
								</div>

								{showSolution && taskData?.solution && (
									<div className='p-8 md:p-12 border-t border-zinc-800/50 bg-amber-500/[0.01] animate-fade-in'>
										<div className='text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/60 mb-8 flex items-center gap-4'>
											Разбор решения{' '}
											<div className='h-px flex-1 bg-amber-500/10'></div>
										</div>
										<div className='text-zinc-400 text-base leading-relaxed mb-8'>
											{renderContent(taskData.solution)}
										</div>
										<div className='bg-zinc-950 p-6 rounded-xl border border-zinc-800 inline-block min-w-[200px]'>
											<div className='text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-2'>
												Верный ответ
											</div>
											<div className='text-white text-2xl font-black'>
												{taskData.answer}
											</div>
										</div>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</main>
			<Footer />
			<style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
		</div>
	)
}
