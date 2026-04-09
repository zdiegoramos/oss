import { Wireframe } from "@oss/ui/components/wireframe";
import { PrimitivesSidebar } from "@/components/primitives-sidebar";

export default function PrimitivesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Wireframe
			config={{
				cssVariables: {
					"--left-sidebar-width-expanded": 60,
				},
			}}
		>
			<PrimitivesSidebar />
			{children}
		</Wireframe>
	);
}
