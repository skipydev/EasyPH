import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { useState } from 'react'

type Topic = {
	id: string
	title: string
	basePath: string
	pages: number
}

type Section = {
	id: string
	title: string
	topics: Topic[]
}

const SECTIONS: Section[] = [
	{
		id: 'mechanics',
		title: 'Механика',
		topics: [
			{
				id: 'kinematics',
				title: 'Кинематика',
				basePath: '/mechanics/kinematics',
				pages: 12,
			},
			{
				id: 'dynamics',
				title: 'Динамика',
				basePath: '/mechanics/dynamics',
				pages: 12,
			},
			{
				id: 'statics',
				title: 'Статика',
				basePath: '/mechanics/statics',
				pages: 11,
			},
			{
				id: 'conservation',
				title: 'Законы сохранения',
				basePath: '/mechanics/conservation',
				pages: 11,
			},
			{
				id: 'oscillations',
				title: 'Колебания и волны',
				basePath: '/mechanics/oscillations',
				pages: 12,
			},
		],
	},
	{
		id: 'thermo',
		title: 'Молекулярная физика и термодинамика',
		topics: [
			{
				id: 'molecular',
				title: 'Молекулярная физика',
				basePath: '/thermodynamics/molecular',
				pages: 15,
			},
			{
				id: 'thermodynamics',
				title: 'Термодинамика',
				basePath: '/thermodynamics/thermodynamics',
				pages: 10,
			},
		],
	},
	{
		id: 'electro',
		title: 'Электродинамика',
		topics: [
			{
				id: 'electric',
				title: 'Электрическое поле',
				basePath: '/electrodynamics/electric-field',
				pages: 15,
			},
			{
				id: 'current',
				title: 'Постоянный ток',
				basePath: '/electrodynamics/current',
				pages: 20,
			},
			{
				id: 'magnetic',
				title: 'Магнитное поле',
				basePath: '/electrodynamics/magnetic',
				pages: 10,
			},
			{
				id: 'induction',
				title: 'Электромагнитная индукция',
				basePath: '/electrodynamics/induction',
				pages: 7,
			},
			{
				id: 'waves',
				title: 'ЭМ колебания и волны',
				basePath: '/electrodynamics/oscillations-waves',
				pages: 14,
			},
		],
	},
	{
		id: 'optics',
		title: 'Оптика',
		topics: [
			{
				id: 'optics',
				title: 'Оптика',
				basePath: '/electrodynamics/optics',
				pages: 19,
			},
		],
	},
	{
		id: 'modern',
		title: 'Современная физика',
		topics: [
			{
				id: 'relativity',
				title: 'СТО',
				basePath: '/relativity/special',
				pages: 6,
			},
			{
				id: 'duality',
				title: 'Корпускулярно-волновой дуализм',
				basePath: '/quantum/duality',
				pages: 6,
			},
			{
				id: 'atom',
				title: 'Физика атома',
				basePath: '/quantum/atom',
				pages: 5,
			},
			{
				id: 'nuclear',
				title: 'Физика ядра',
				basePath: '/quantum/nuclear',
				pages: 7,
			},
		],
	},
]

export function BankPage() {
	const firstTopic: Topic = SECTIONS[0]?.topics[0]!
	const [topic, setTopic] = useState<Topic>(() => firstTopic)
	const [page, setPage] = useState(1)
	const [zoom, setZoom] = useState(1)
	const [mobileMenu, setMobileMenu] = useState(false)

	const imgSrc = `${topic.basePath}/${String(page).padStart(3, '0')}.png`

	return (
		<div className='min-h-screen bg-black text-gray-100 selection:bg-amber-500/30'>
			<Header />

			<main className='flex pt-16 min-h-screen'>
				{/* SIDEBAR */}
				<aside className='hidden md:block w-80 shrink-0 bg-zinc-950 border-r border-zinc-900 overflow-y-auto h-[calc(100vh-64px)] sticky top-16 custom-scrollbar'>
					<div className='p-8 space-y-10'>
						<div className='space-y-1'>
							<div className='text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/60 mb-6'>
								Навигатор разделов
							</div>
							{SECTIONS.map(section => (
								<div key={section.id} className='pt-4 first:pt-0'>
									<h3 className='px-4 text-[11px] font-bold uppercase text-zinc-500 mb-3 tracking-widest'>
										{section.title}
									</h3>
									<div className='space-y-1'>
										{section.topics.map(t => (
											<button
												key={t.id}
												onClick={() => {
													setTopic(t)
													setPage(1)
													setZoom(1)
												}}
												className={`w-full group flex items-center justify-between text-left px-4 py-3 rounded-xl transition-all duration-200 ${
													t.id === topic.id
														? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]'
														: 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent'
												}`}
											>
												<span className='text-sm font-medium tracking-tight leading-tight'>
													{t.title}
												</span>
												{t.id === topic.id && (
													<div className='w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]' />
												)}
											</button>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</aside>

				{/* CONTENT AREA */}
				<section className='flex-1 flex flex-col bg-zinc-950/20 relative'>
					{/* FLOATING CONTROLS */}
					<div className='sticky top-20 z-30 mx-auto w-fit mt-4'>
						<div className='flex items-center gap-2 bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800 p-2 rounded-2xl shadow-2xl'>
							{/* Pagination */}
							<div className='flex items-center bg-black/40 rounded-xl px-2 border border-zinc-800/50'>
								<button
									onClick={() => setPage(p => Math.max(1, p - 1))}
									className='p-3 text-zinc-400 hover:text-amber-500 transition-colors disabled:opacity-20'
									disabled={page === 1}
								>
									<svg
										className='w-5 h-5'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M15 19l-7-7 7-7'
										/>
									</svg>
								</button>

								<div className='px-4 py-2 text-center min-w-[120px]'>
									<div className='text-[9px] font-black text-zinc-600 uppercase tracking-tighter'>
										Страница
									</div>
									<div className='text-sm font-black text-white leading-none'>
										{page} <span className='text-zinc-600 mx-1'>/</span>{' '}
										{topic.pages}
									</div>
								</div>

								<button
									onClick={() => setPage(p => Math.min(topic.pages, p + 1))}
									className='p-3 text-zinc-400 hover:text-amber-500 transition-colors disabled:opacity-20'
									disabled={page === topic.pages}
								>
									<svg
										className='w-5 h-5'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M9 5l7 7-7 7'
										/>
									</svg>
								</button>
							</div>

							<div className='w-px h-8 bg-zinc-800 mx-1 hidden md:block' />

							{/* Zoom Controls */}
							<div className='hidden md:flex items-center bg-black/40 rounded-xl border border-zinc-800/50 px-1'>
								<button
									onClick={() => setZoom(z => Math.max(0.6, z - 0.2))}
									className='p-3 text-zinc-400 hover:text-amber-500 transition-colors'
								>
									<svg
										className='w-4 h-4'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={3}
											d='M20 12H4'
										/>
									</svg>
								</button>
								<span className='text-[10px] font-black text-zinc-300 w-12 text-center'>
									{Math.round(zoom * 100)}%
								</span>
								<button
									onClick={() => setZoom(z => Math.min(2.5, z + 0.2))}
									className='p-3 text-zinc-400 hover:text-amber-500 transition-colors'
								>
									<svg
										className='w-4 h-4'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={3}
											d='M12 4v16m8-8H4'
										/>
									</svg>
								</button>
							</div>

							{/* MOBILE MENU BUTTON */}
							<button
								className='md:hidden p-3 bg-amber-500 text-black rounded-xl'
								onClick={() => setMobileMenu(true)}
							>
								<svg
									className='w-5 h-5'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M4 6h16M4 12h16m-7 6h7'
									/>
								</svg>
							</button>
						</div>
					</div>

					{/* VIEWPORT AREA */}
					<div className='flex-1 overflow-auto flex justify-center items-start px-4 py-12 custom-scrollbar bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:20px_20px]'>
						<div
							className='relative group transition-transform duration-300 ease-out'
							style={{
								transform: `scale(${zoom})`,
								transformOrigin: 'top center',
							}}
						>
							<img
								src={imgSrc}
								draggable={false}
								alt={`Page ${page}`}
								className='bg-white shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/5 rounded-sm select-none'
								style={{ transition: 'none' }}
							/>
							{/* Subtle border to simulate paper */}
							<div className='absolute inset-0 pointer-events-none ring-1 ring-black/10' />
						</div>
					</div>

					{/* MOBILE BOTTOM CONTROLS */}
					<div className='md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)]'>
						<div className='flex justify-between items-center bg-zinc-900/90 backdrop-blur-2xl border border-zinc-800 p-2 rounded-2xl shadow-2xl'>
							<button
								onClick={() => setPage(p => Math.max(1, p - 1))}
								className='flex-1 py-4 bg-zinc-950 rounded-xl text-amber-500 flex justify-center border border-zinc-800'
							>
								<svg
									className='w-6 h-6'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M15 19l-7-7 7-7'
									/>
								</svg>
							</button>
							<div className='px-6 text-center'>
								<div className='text-[10px] font-black text-zinc-600 uppercase'>
									{page} / {topic.pages}
								</div>
							</div>
							<button
								onClick={() => setPage(p => Math.min(topic.pages, p + 1))}
								className='flex-1 py-4 bg-zinc-950 rounded-xl text-amber-500 flex justify-center border border-zinc-800'
							>
								<svg
									className='w-6 h-6'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M9 5l7 7-7 7'
									/>
								</svg>
							</button>
						</div>
					</div>
				</section>
			</main>

			
			{mobileMenu && (
				<div className='fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl animate-fade-in'>
					<div className='h-full flex flex-col'>
						<div className='p-6 border-b border-zinc-900 flex justify-between items-center'>
							<div className='text-[10px] font-black uppercase tracking-widest text-amber-500'>
								Меню разделов
							</div>
							<button
								onClick={() => setMobileMenu(false)}
								className='w-10 h-10 flex items-center justify-center bg-zinc-900 rounded-full text-zinc-400 hover:text-white'
							>
								✕
							</button>
						</div>

						<div className='flex-1 overflow-y-auto p-6 space-y-10'>
							{SECTIONS.map(section => (
								<div key={section.id}>
									<h3 className='text-[11px] font-bold uppercase text-zinc-500 mb-4 tracking-widest'>
										{section.title}
									</h3>
									<div className='grid grid-cols-1 gap-2'>
										{section.topics.map(t => (
											<button
												key={t.id}
												onClick={() => {
													setTopic(t)
													setPage(1)
													setZoom(1)
													setMobileMenu(false)
												}}
												className={`w-full text-left px-5 py-4 rounded-2xl transition-all ${
													t.id === topic.id
														? 'bg-amber-500 text-black font-bold'
														: 'bg-zinc-900/50 text-zinc-300 border border-zinc-800'
												}`}
											>
												{t.title}
											</button>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			<Footer />

			<style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
		</div>
	)
}
