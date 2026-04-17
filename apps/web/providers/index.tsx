"use client";

import { Toaster } from "@oss/ui/components/sonner";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
			{children}
			<Toaster richColors />
		</ThemeProvider>
	);
}
