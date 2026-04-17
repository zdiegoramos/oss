import type { NavRoute } from "@oss/ui/hooks/use-nav-routes";
import { BlocksIcon, LayoutGrid } from "lucide-react";

export const USER_NAV_ROUTES = [
	{
		href: "/forms",
		name: "Forms",
		icon: LayoutGrid,
		activePatterns: ["/forms", "/forms/*"],
	},
	{
		href: "/primitives",
		name: "Primitives",
		icon: BlocksIcon,
		activePatterns: ["/primitives", "/primitives/*"],
	},
] as const satisfies readonly NavRoute[];
