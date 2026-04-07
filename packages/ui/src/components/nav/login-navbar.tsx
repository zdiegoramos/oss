"use client";

import { Button } from "@oss/ui/components/button";
import { NavLogoWithText } from "@oss/ui/components/nav/nav-logo";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export function LoginNavbar() {
	return (
		<div className="z-50 flex h-full w-full items-center justify-between">
			<NavLogoWithText />
			<nav className="flex h-full items-center gap-2">
				<Button>
					<Link href="/">
						<HomeIcon />
						Inicio
					</Link>
				</Button>
			</nav>
		</div>
	);
}
