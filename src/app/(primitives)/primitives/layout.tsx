import { PrimitivesSidebar } from "@/components/nav/primitives-sidebar";
import { PrimitivesNav } from "@/components/nav/section-nav";
import { Wireframe } from "@/components/ui/wireframe";

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
      <PrimitivesNav />
      {children}
    </Wireframe>
  );
}
