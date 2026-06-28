import { motion } from 'framer-motion'
import { IconType } from 'react-icons'

interface AnimatedFactProps {
	title: string
	description: string
	icon?: IconType
	delay?: number
}

export function AnimatedFact({
	title,
	description,
	icon: Icon,
	delay = 0,
}: AnimatedFactProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '-50px' }}
			transition={{ 
				duration: 0.8, 
				delay: delay / 1000, // Переводим мс в секунды для Framer
				ease: [0.16, 1, 0.3, 1] 
			}}
			className='group relative list-none'
		>
			{/* Основной контейнер */}
			<div className='relative overflow-hidden rounded-[2.5rem] bg-zinc-950/40 backdrop-blur-md border border-white/5 p-10 transition-all duration-700 ease-out group-hover:bg-zinc-900/40 group-hover:border-emerald-500/30 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.05)]'>
				
				{/* ТЕХНИЧЕСКАЯ СЕТОЧКА (Dot Grid) */}
				<div className="absolute inset-0 z-0 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-700 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:24px_24px]" />
				
				{/* МИНИ-ЛАМПОЧКА В УГЛУ (Связь с индикатором системы) */}
				<div className="absolute top-8 right-8">
					<div className="w-1.5 h-1.5 bg-emerald-500/20 rounded-full group-hover:bg-emerald-500 group-hover:shadow-[0_0_10px_#10b981] transition-all duration-700" />
				</div>

				<div className='relative z-10 flex flex-col items-start text-left'>
					{/* ИКОНКА */}
					{Icon && (
						<div className='relative mb-8'>
							<div className='absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
							<div className='relative w-16 h-16 flex items-center justify-center rounded-2xl bg-zinc-900/50 border border-white/5 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/5 transition-all duration-700'>
								<Icon className='w-7 h-7 text-zinc-500 group-hover:text-emerald-400 transition-colors duration-700' />
							</div>
						</div>
					)}

					{/* ТЕКСТ */}
					<h3 className='text-xs font-black uppercase tracking-[0.3em] text-zinc-200 mb-4 group-hover:text-white transition-colors duration-500'>
						{title}
					</h3>
					
					<p className='text-sm text-zinc-500 leading-relaxed font-medium group-hover:text-zinc-400 transition-colors duration-500'>
						{description}
					</p>
				</div>

				{/* Тонкая полоска прогресса снизу (декоративная) */}
				<div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent w-0 group-hover:w-full transition-all duration-1000" />
			</div>
		</motion.div>
	)
}