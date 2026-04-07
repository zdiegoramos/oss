import { FormsSidebar } from "@oss/ui/components/nav/forms-sidebar";
import { FormsNav } from "@oss/ui/components/nav/section-nav";
import { Wireframe } from "@oss/ui/components/wireframe";

export default function FormsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Wireframe>
			<FormsSidebar />
			<FormsNav />
			{children}
		</Wireframe>
	);
}
