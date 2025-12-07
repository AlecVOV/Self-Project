import { useState } from 'react';
import type { AppBarProps } from '../resources/types';

const themes = [
	{ id: 'auto', icon: 'routine' },
	{ id: 'light', icon: 'light_mode' },
	{ id: 'dark', icon: 'dark_mode' },
]

export default function ({ title }: AppBarProps) {
	let [theme, setTheme] = useState(0);
	ui('mode', themes[theme].id);

	function updateTheme() {
		console.log('updating theme to', themes[(theme + 1) % themes.length].id);
		setTheme((theme + 1) % themes.length);
		ui('mode', themes[theme].id);
	}

	return (
		<header>
			<nav>
				<button className='circle transparent l'>
					<i>menu</i>
				</button>

				<div className='max'></div>

				<button className='circle transparent' onClick={updateTheme}>
					<i>{themes[theme].icon}</i>
				</button>
			</nav>

			<div className='small-padding'>
				<h2 className='small'>{title}</h2>
			</div>
		</header>
	)
}
