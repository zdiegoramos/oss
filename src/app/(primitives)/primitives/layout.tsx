import { PrimitivesSidebar } from "@/components/nav/primitives-sidebar";
import { PrimitivesNav } from "@/components/nav/section-nav";
import { Wireframe } from "@/components/ui/wireframe";
import { Providers } from "@/providers";

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
      <Providers>
        <PrimitivesSidebar />
        <PrimitivesNav />
        {children}
      </Providers>
    </Wireframe>
  );
}
