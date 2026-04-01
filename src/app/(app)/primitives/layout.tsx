import { PrimitivesSidebar } from "@/components/nav/primitives-sidebar";
import { PrimitivesNav } from "@/components/nav/section-nav";
import { WireframeDefault } from "@/components/wireframe-default";
import { Providers } from "@/providers";

export default function PrimitivesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WireframeDefault>
      <Providers>
        <PrimitivesSidebar />
        <PrimitivesNav />
        {children}
      </Providers>
    </WireframeDefault>
  );
}
