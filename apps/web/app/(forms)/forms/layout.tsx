import { Wireframe } from "@oss/ui/components/wireframe";
import { FormsSidebar } from "components/form-sidebar";

export default function FormsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Wireframe>
			<FormsSidebar />
			{children}
		</Wireframe>
	);
}
