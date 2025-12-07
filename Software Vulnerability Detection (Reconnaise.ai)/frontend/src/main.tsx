import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router';

import 'beercss';
import 'material-dynamic-colors';
import './Layout.css'

import Layout from './Layout.tsx'
import Team from './routes/Team.tsx'
import EDA from './routes/EDA.tsx';
import Model from './routes/Model.tsx';
import Input from './routes/Input.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route index element={<Input />} />
					<Route path='/model' element={<Model />} />
					<Route path='/eda' element={<EDA />} />
					<Route path='/team' element={<Team />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>
)
