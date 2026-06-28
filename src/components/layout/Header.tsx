import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isScrolled, setIsScrolled] = useState(false)
	const location = useLocation()

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20)
		}
		handleScroll()
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const navItems = [
		{ path: '/', label: 'Главная' },
		{ path: '/ege', label: 'Подготовка к ЕГЭ' },
		{ path: '/bank', label: 'Банк знаний' },
		{ path: '/about', label: 'О сайте' },
	]

	const isActive = (path: string) => location.pathname === path

	return (
		<>
			<header
				className={`fixed top-4 left-20 right-20 md:left-60 md:right-60 z-50 transition-all duration-500 ${
					isScrolled
						? 'bg-zinc-950/70 backdrop-blur-2xl border border-zinc-700/50 shadow-xl shadow-black/40' // было /85 → стало /70
						: 'bg-zinc-950/50 backdrop-blur-xl border border-zinc-700/30'
				} rounded-full shadow-xl`}
			>
				<div className='max-w-7xl mx-auto px-5 md:px-8'>
					<div className='flex justify-between items-center h-12 md:h-14'>
						<Link
							to='/'
							className='text-xl md:text-2xl text-white font-extrabold '
						>
							EasyФизика
						</Link>

						<nav className='hidden md:flex items-center gap-8'>
							{navItems.map(item => (
								<Link
									key={item.path}
									to={item.path}
									className={`text-sm font-medium text-white ${
										isActive(item.path) ? 'text-white' : 'hover:text-white'
									}`}
								>
									{item.label}
								</Link>
							))}
						</nav>

						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className='md:hidden p-2.5 rounded-full hover:bg-zinc-800/60 transition-colors'
							aria-label='Меню'
						>
							{isMenuOpen ? (
								<X className='h-6 w-6 text-zinc-200' />
							) : (
								<Menu className='h-6 w-6 text-zinc-200' />
							)}
						</button>
					</div>
				</div>
			</header>

			<div
				className={`fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-500 ease-in-out ${
					isMenuOpen ? 'translate-y-0' : 'translate-y-full'
				} md:hidden`}
			>
				<div className='bg-zinc-950/95 backdrop-blur-2xl border-t border-zinc-800/70 rounded-t-3xl max-h-[80vh] overflow-y-auto'>
					<div className='p-6'>
						<div className='flex justify-between items-center mb-6'>
							<span className='text-lg font-bold text-white'>Меню</span>
							<button
								onClick={() => setIsMenuOpen(false)}
								className='text-zinc-400'
							>
								<X className='h-7 w-7' />
							</button>
						</div>

						<div className='flex flex-col gap-5'>
							{navItems.map(item => (
								<Link
									key={item.path}
									to={item.path}
									onClick={() => setIsMenuOpen(false)}
									className={`text-lg font-medium text-white ${
										isActive(item.path) ? 'text-white' : 'hover:text-white'
									}`}
								>
									{item.label}
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
			{isMenuOpen && (
				<div
					className='fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden'
					onClick={() => setIsMenuOpen(false)}
				/>
			)}
		</>
	)
}
