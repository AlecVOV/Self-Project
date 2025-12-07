import { NavLink } from "react-router";
import rString from "../resources/string";
import type { NavigationProps } from "../resources/types";

export default function NavigationRail({ routes }: NavigationProps) {
	return (<nav className="m l left max center-align primary-container">
		<header>
			<img className="responsive" src="/logo.svg" alt={rString.alt_logo} />
		</header>
		<div className="large-space" />

		{routes.sort().map((route) => (
			<NavLink key={route.href} to={route.href}>
				<i>{route.icon}</i>
				<span>{route.label}</span>
			</NavLink>
		))}

		<div className="large-space" />

		<p>{rString.app_name}</p>
		<p>by {rString.team_name}</p>

		<div className="small-space" />

		<p>
			<abbr title={rString.unit_name}>{rString.unit_code}</abbr>
			<span className="tooltip right">{rString.unit_name}</span>
		</p>
		<p>
			<abbr title={rString.assignment_subtitle}>{rString.assignment_title}</abbr>
			<span className="tooltip right">{rString.assignment_subtitle}</span>
		</p>
	</nav>)
}
