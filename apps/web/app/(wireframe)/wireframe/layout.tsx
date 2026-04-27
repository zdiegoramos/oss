'use client"';

import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { RoutesButton } from "@/components/wireframe/routes-button";

export const metadata: Metadata = {
	title: "App Wireframe",
	description: "App Wireframe",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			disableTransitionOnChange
			enableSystem={false}
		>
			{children}
			<RoutesButton />
		</ThemeProvider>
	);
}
