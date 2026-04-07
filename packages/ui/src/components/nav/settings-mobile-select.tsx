"use client";

import { useWireframe } from "@oss/ui/components/wireframe";
import { cn } from "@oss/ui/lib/utils";
import { usePathname, useRouter } from "next/navigation";

type SettingsNavItem = {
	title: string;
	href: string;
	icon: string;
};

type SettingsMobileSelectProps = {
	items: SettingsNavItem[];
	className?: string;
};

/**
 * Mobile select for settings navigation
 * Only renders on mobile devices (< 768px, as defined by MOBILE_BREAKPOINT)
 */
export function SettingsMobileSelect({
	items,
	className,
}: SettingsMobileSelectProps) {
	const router = useRouter();
	const pathname = usePathname();
	const { isMobile } = useWireframe();

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		router.push(event.target.value);
	};

	if (!isMobile) {
		return null;
	}

	return (
		<div className={cn("mb-6", className)}>
			<label className="sr-only" htmlFor="settings-nav">
				Navegación de configuración
			</label>
			<select
				className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
				id="settings-nav"
				onChange={handleChange}
				value={pathname}
			>
				{items.map((item) => (
					<option key={item.href} value={item.href}>
						{item.title}
					</option>
				))}
			</select>
		</div>
	);
}
