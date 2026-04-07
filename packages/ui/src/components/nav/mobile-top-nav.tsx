"use client";

import { NavLogoWithText } from "@oss/ui/components/nav/nav-logo";
import { cn } from "@oss/ui/lib/utils";

export type MobileTopNavProps = {
	/** Optional brand name */
	brandName?: string;
	/** Optional className for customization */
	className?: string;
};

/**
 * Mobile top navigation component
 * Displays only the logo and brand name on top left
 */
export function MobileTopNav({ className }: MobileTopNavProps) {
	return (
		<div
			className={cn(
				"flex h-full w-full items-center",
				"bg-background/95 backdrop-blur-md",
				"border-border/40 border-b",
				"px-4",
				"shadow-sm",
				className
			)}
		>
			<NavLogoWithText />
		</div>
	);
}
