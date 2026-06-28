import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'

export function AboutPage() {
	return (
		<div className='min-h-screen bg-gray-50'>
			<Header />

			<main>
				<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
					<div className='text-center mb-12'>
						<h1 className='text-4xl font-bold text-gray-900 mb-4'>О нас</h1>
						<p className='text-lg text-gray-600'>
							Современная платформа для изучения физики
						</p>
					</div>

					<div className='bg-white rounded-lg shadow-lg p-8 space-y-6'>
						<section>
							<h2 className='text-2xl font-semibold text-gray-900 mb-4'>
								Наша миссия
							</h2>
							<p className='text-gray-700 leading-relaxed'>
								Мы стремимся сделать изучение физики доступным, интересным и
								эффективным для каждого ученика. Наша платформа использует
								современные технологии, включая нейросети для генерации задач,
								чтобы каждый студент мог получить индивидуальный подход к
								обучению.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold text-gray-900 mb-4'>
								Что мы предлагаем
							</h2>
							<ul className='space-y-3 text-gray-700'>
								<li className='flex items-start'>
									<span className='w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0'></span>
									<span>Генерация задач с помощью нашей нейросети</span>
								</li>
								<li className='flex items-start'>
									<span className='w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0'></span>
									<span>Мгновенная проверка ответов</span>
								</li>
								<li className='flex items-start'>
									<span className='w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0'></span>
									<span>Адаптивное обучение под уровень знаний</span>
								</li>
								<li className='flex items-start'>
									<span className='w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0'></span>
									<span>Полностью бесплатный доступ</span>
								</li>
								<li className='flex items-start'>
									<span className='w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0'></span>
									<span>Работает на всех устройствах</span>
								</li>
							</ul>
						</section>

						<section>
							<h2 className='text-2xl font-semibold text-gray-900 mb-4'>
								Контакты
							</h2>
							<p className='text-gray-700'>
								По всем вопросам вы можете связаться с нами через раздел
								"Обратная связь" или написать на почту skipy1@proton.com
							</p>
						</section>
					</div>

					<div className='mt-8 text-center'>
						<a
							href='/'
							className='inline-flex items-center px-6 py-3 border border-primary-600 text-base font-medium rounded-lg text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors'
						>
							Вернуться на главную
						</a>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	)
}
