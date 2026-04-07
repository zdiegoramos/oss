import { ToolsNav } from "@oss/ui/components/nav/section-nav";
import { ToolsSidebar } from "@oss/ui/components/nav/tools-sidebar";
import { Wireframe } from "@oss/ui/components/wireframe";

export default function ToolsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Wireframe>
			<ToolsSidebar />
			<ToolsNav />
			{children}
		</Wireframe>
	);
}
