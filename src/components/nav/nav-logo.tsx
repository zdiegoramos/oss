import Image from "next/image";
import { APP } from "@/lib/metadata";

function NavLogo() {
  return (
    <Image
      alt={`${APP.displayName} Logo`}
      className="aspect-square w-10 object-contain"
      height={472}
      src="/logo.png"
      width={472}
    />
  );
}

export function NavLogoWithText() {
  return (
    <div className="flex items-center gap-3">
      <NavLogo />
      <div className="font-semibold text-xl">{APP.displayName}</div>
    </div>
  );
}
