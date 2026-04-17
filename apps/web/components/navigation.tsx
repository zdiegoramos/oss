"use client";

import { Navigation } from "@oss/ui/components/nav/navigation";
import { USER_NAV_ROUTES } from "config/nav";

export function UserNavigation() {
	return <Navigation routes={USER_NAV_ROUTES} />;
}
