import { ToolsNav } from "@/components/nav/section-nav";
import { ToolsSidebar } from "@/components/nav/tools-sidebar";
import { Wireframe } from "@/components/ui/wireframe";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Wireframe>
      <ToolsSidebar />
      <ToolsNav />
      {children}
    </Wireframe>
  );
}
