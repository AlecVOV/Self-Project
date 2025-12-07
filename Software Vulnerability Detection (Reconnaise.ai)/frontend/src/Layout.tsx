import { Outlet } from "react-router"
import { mainMenu } from "./resources/menu"
import NavigationBar from "./components/NavigationBar"
import NavigationRail from "./components/NavigationRail"

export default function () {
	ui("theme", "#86D1EA")

	return (<>
		<NavigationBar routes={mainMenu} />
		<NavigationRail routes={mainMenu} />
		<main><Outlet /></main>
	</>)
}
