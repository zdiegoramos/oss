"use client";

import {
	ADMIN_NAV_ROUTES,
	type NavRoutes,
	USER_NAV_ROUTES,
} from "@oss/ui/components/nav/config";
import { MobileBottomNav } from "@oss/ui/components/nav/mobile-bottom-nav";
import { MobileTopNav } from "@oss/ui/components/nav/mobile-top-nav";
import { NavLogoWithText } from "@oss/ui/components/nav/nav-logo";
import { NavbarLinks } from "@oss/ui/components/nav/navbar-links";
import { UserMenu } from "@oss/ui/components/nav/user-menu";
import { WireframeNav } from "@oss/ui/components/wireframe";
import { cn } from "@oss/ui/lib/utils";
import type { ReactNode } from "react";

function AppNavbar({
	children,
	className,
}: {
	children?: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex h-full w-full items-center justify-between",
				"bg-background/95 backdrop-blur-md",
				"border-border/40 border-b",
				"px-4 md:px-6 lg:px-8",
				"shadow-sm",
				className
			)}
		>
			<NavLogoWithText />
			<nav className="flex h-full items-center gap-2 md:gap-4">
				{children}
				<div className="ml-2">
					<UserMenu />
				</div>
			</nav>
		</div>
	);
}

function Navigation({ routes }: { routes: NavRoutes }) {
	return (
		<>
			{/* Mobile: Top nav with logo only */}
			<WireframeNav hide="desktop" position="top">
				<MobileTopNav />
			</WireframeNav>

			{/* Mobile: Bottom nav with icons and user menu */}
			<WireframeNav hide="desktop" position="bottom">
				<MobileBottomNav routes={routes} />
			</WireframeNav>

			{/* Desktop: Top nav with full navbar */}
			<WireframeNav hide="mobile" position="top">
				<AppNavbar>
					<NavbarLinks routes={routes} />
				</AppNavbar>
			</WireframeNav>
		</>
	);
}

export function UserNavigation() {
	return <Navigation routes={USER_NAV_ROUTES} />;
}

export function AdminNavigation() {
	return <Navigation routes={ADMIN_NAV_ROUTES} />;
}
