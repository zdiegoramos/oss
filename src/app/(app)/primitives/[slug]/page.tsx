import { notFound } from "next/navigation";
import { PRIMITIVES_NAV } from "@/components/nav/primitives";
import { TextInputDemo } from "./text-input-demo";

const DEMO_MAP: Record<string, React.ComponentType> = {
  "text-input": TextInputDemo,
};

export default async function PrimitiveDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const Demo = DEMO_MAP[slug];
  const primitive = PRIMITIVES_NAV.find(
    (p) => p.href === `/primitives/${slug}`
  );

  if (!(Demo && primitive)) {
    notFound();
  }

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
