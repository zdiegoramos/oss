import { WireframeNav } from "@oss/ui/components/wireframe";
import Image from "next/image";

export function AppMobileTopNav() {
	return (
		<WireframeNav
			className="flex items-center justify-between border-b bg-background px-4"
			hide="desktop"
			position="top"
		>
			<div className="flex items-center gap-3">
				<Image
					alt="Logo"
					className="size-7"
					height={512}
					src="/logo.png"
					width={512}
				/>
				<div>
					<div className="font-bold text-sm">Diego Ramos</div>
					<div className="font-medium text-muted-foreground text-xs">
						Full-Stack Engineer
					</div>
				</div>
			</div>
		</WireframeNav>
	);
}
