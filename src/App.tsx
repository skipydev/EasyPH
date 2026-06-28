import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { AboutPage } from './pages/AboutPage'
import { BankPage } from './pages/BankPage'
import { EgePage } from './pages/EgePage'
import { Home } from './pages/Home'
import { NeuronkaPage } from './pages/NeuronkaPage'
import { TestLevelPage } from './pages/TestLevelPage'

export default function App() {
	return (
		<Router>
			<div className='App'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/ege' element={<EgePage />} />
					<Route path='/bank' element={<BankPage />} />
					<Route path='/testlvl' element={<TestLevelPage />} />
					<Route path='/about' element={<AboutPage />} />
					<Route path='/neyronka' element={<NeuronkaPage />} />
				</Routes>
			</div>
		</Router>
	)
}
