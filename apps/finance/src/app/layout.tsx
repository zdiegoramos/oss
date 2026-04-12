import { Geist, Geist_Mono } from "next/font/google";
import "@/utils/orpc.server";
import "@/index.css";
import { Wireframe } from "@oss/ui/components/wireframe";
import { cn } from "@oss/ui/lib/utils";
import type { Metadata } from "next";
import { Navbar } from "@/components/navigation";
import { generateMetadata } from "@/lib/seo";
import Providers from "@/providers";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});

export const metadata: Metadata = generateMetadata({
	title: "Finance",
	description: "Scan invoices and track your finances",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			className={cn(
				"overscroll-none antialiased [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				fontMono.variable,
				"font-sans",
				geist.variable
			)}
			lang="en"
			suppressHydrationWarning
		>
			<body className="overscroll-none">
				<Providers>
					<Wireframe>
						<Navbar />
						{children}
					</Wireframe>
				</Providers>
			</body>
		</html>
	);
}
