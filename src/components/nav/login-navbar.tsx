"use client";

import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { NavLogoWithText } from "@/components/nav/nav-logo";
import { Button } from "@/components/ui/button";

export function LoginNavbar() {
  return (
    <div className="z-50 flex h-full w-full items-center justify-between">
      <NavLogoWithText />
      <nav className="flex h-full items-center gap-2">
        <Button>
          <Link href="/">
            <HomeIcon />
            Inicio
          </Link>
        </Button>
      </nav>
    </div>
  );
}
