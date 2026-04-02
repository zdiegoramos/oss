import { FormsSidebar } from "@/components/nav/forms-sidebar";
import { FormsNav } from "@/components/nav/section-nav";
import { Wireframe } from "@/components/ui/wireframe";

export default function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Wireframe>
      <FormsSidebar />
      <FormsNav />
      {children}
    </Wireframe>
  );
}
