import { NavLink } from "react-router";
import type { NavigationProps } from "../resources/types";

export default function NavigationBar({ routes }: NavigationProps) {
	return (<nav className="s bottom">
		{routes.sort().map((item) => (
			<NavLink key={item.href} to={item.href}>
				<i>{item.icon}</i>
				<span>{item.label}</span>
			</NavLink>
		))}
	</nav>)
}
