import { getPrimitiveDetail, type PrimitiveSlug } from "./primitive-registry";

export function PrimitivePage({ slug }: { slug: PrimitiveSlug }) {
	const { Demo, primitive } = getPrimitiveDetail(slug);

	return (
		<main className="p-6">
			<div className="mb-6">
				<h1 className="font-bold text-2xl">{primitive.name}</h1>
				<p className="text-muted-foreground text-sm">{primitive.description}</p>
			</div>

			<div className="max-w-prose">
				<Demo />
			</div>
		</main>
	);
}

export function createPrimitivePage(slug: PrimitiveSlug) {
	return function PrimitiveRoutePage() {
		return <PrimitivePage slug={slug} />;
	};
}
