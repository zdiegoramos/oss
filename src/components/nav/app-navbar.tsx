"use client";

import type { ReactNode } from "react";
import { NavLogoWithText } from "@/components/nav/nav-logo";
import { UserMenu } from "@/components/nav/user-menu";
import { cn } from "@/lib/utils";

export type AppNavbarProps = {
  /** Navigation links component to render */
  children?: ReactNode;
  /** Optional className for customization */
  className?: string;
};

/**
 * Desktop navigation bar component
 * Displays logo, brand name, navigation links, and user menu
 */
export function AppNavbar({ children, className }: AppNavbarProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-between",
        "bg-background/95 backdrop-blur-md",
        "border-border/40 border-b",
        "px-4 md:px-6 lg:px-8",
        "shadow-sm",
        className
      )}
    >
      <NavLogoWithText />
      <nav className="flex h-full items-center gap-2 md:gap-4">
        {children}
        <div className="ml-2">
          <UserMenu />
        </div>
      </nav>
    </div>
  );
}
