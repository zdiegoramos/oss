// import {
// 	Card,
// 	CardDescription,
// 	CardHeader,
// 	CardTitle,
// } from "@oss/ui/components/card";
// import { PRIMITIVES_NAV } from "@oss/ui/components/nav/primitives";
// import Link from "next/link";

export default function PrimitivesPage() {
	return (
		<main className="p-6">
			<div className="mb-6">
				<h1 className="font-bold text-2xl">Primitives</h1>
				<p className="text-muted-foreground text-sm">
					Browse the available form input primitives in this codebase.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{/* {PRIMITIVES_NAV.map((primitive) => (
					<Link href={primitive.href} key={primitive.href}>
						<Card className="h-full transition-colors hover:bg-muted/50">
							<CardHeader>
								<div className="mb-2 flex size-9 items-center justify-center rounded-md bg-muted">
									<primitive.icon className="size-5 text-muted-foreground" />
								</div>
								<CardTitle className="text-base">{primitive.name}</CardTitle>
								<CardDescription>{primitive.description}</CardDescription>
							</CardHeader>
						</Card>
					</Link>
				))} */}
			</div>
		</main>
	);
}
