import { useEffect } from "react";
import { useLocation } from "react-router";
import rString from "../resources/string";
import type { PageMetadataProps } from "../resources/types";

export default function ({ title, description }: PageMetadataProps) {
	const location = useLocation();

	useEffect(() => {
		document.title = `${title} / ${rString.app_name}`;
	}, [location, title]);

	return (<>
		<meta name="description" content={description} />
	</>)
}
