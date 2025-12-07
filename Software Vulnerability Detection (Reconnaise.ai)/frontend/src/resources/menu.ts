import rString from "./string";
import type { MenuItem } from "./types";

/**
 * Main menu, shows in navigation rail and bar.
 * Sorted by weight (ascending).
 * No more than five items recommended!
 */
const mainMenu: MenuItem[] = [
	{
		href: '/',
		icon: 'input',
		label: rString.nav_label_input,
		weight: 100
	},
	{
		href: '/team',
		icon: 'people',
		label: rString.nav_label_team,
		weight: 200
	},
	{
		href: '/eda',
		icon: 'bar_chart',
		label: rString.nav_label_eda,
		weight: 300
	},
	{
		href: '/model',
		icon: 'model_training',
		label: rString.nav_label_model,
		weight: 400
	},
]

export { mainMenu };
