import { UserNavigation } from "@/components/nav/navigation";
import { WireframeDefault } from "@/components/wireframe-default";
import { Providers } from "@/providers";

export default async function Home() {
  return (
    <WireframeDefault>
      <Providers>
        <UserNavigation />
        <main className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          Hello World.
        </main>
      </Providers>
    </WireframeDefault>
  );
}
