import { Wireframe } from "@oss/ui/components/wireframe";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "App Wireframe",
	description: "App Wireframe",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return <Wireframe className="bg-amber-200">{children}</Wireframe>;
}
