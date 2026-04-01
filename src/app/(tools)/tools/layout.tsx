import { ToolsNav } from "@/components/nav/section-nav";
import { ToolsSidebar } from "@/components/nav/tools-sidebar";
import { Wireframe } from "@/components/ui/wireframe";
import { Providers } from "@/providers";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Wireframe>
      <Providers>
        <ToolsSidebar />
        <ToolsNav />
        {children}
      </Providers>
    </Wireframe>
  );
}
