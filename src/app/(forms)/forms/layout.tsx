import { FormsSidebar } from "@/components/nav/forms-sidebar";
import { FormsNav } from "@/components/nav/section-nav";
import { Wireframe } from "@/components/ui/wireframe";
import { Providers } from "@/providers";

export default function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Wireframe>
      <Providers>
        <FormsSidebar />
        <FormsNav />
        {children}
      </Providers>
    </Wireframe>
  );
}
