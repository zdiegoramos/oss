"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isRouteActive, type NavRoutes } from "@/components/nav/config";
import { cn } from "@/lib/utils";

export type NavbarLinksProps = {
  /** Array of navigation routes to display */
  routes: NavRoutes;
  /** Optional className for customization */
  className?: string;
};

/**
 * Reusable navigation links component
 * Renders a list of navigation items with active state management
 */
export function NavbarLinks({ routes, className }: NavbarLinksProps) {
  const pathname = usePathname();

  return (
    <>
      {routes.map((route) => {
        const Icon = route.icon;
        const isActive = isRouteActive(pathname, route.activePatterns);

        return (
          <Link
            aria-current={isActive === true && "page"}
            className={cn(
              "group relative flex h-full min-w-[10ch] flex-none flex-col items-center justify-center gap-1.5 overflow-hidden px-3",
              "transition-all duration-200 ease-in-out",
              "hover:bg-muted/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isActive
                ? "bg-muted/40 font-semibold text-foreground"
                : "font-medium text-muted-foreground hover:text-foreground",
              className
            )}
            href={route.href}
            key={`navbar-link-${route.href}`}
          >
            <Icon
              aria-hidden="true"
              className={cn(
                "size-5 transition-transform duration-200",
                "group-hover:scale-110",
                isActive === true && "scale-105"
              )}
            />
            <span className="text-xs tracking-wide">{route.name}</span>
            {isActive === true && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-primary" />
            )}
          </Link>
        );
      })}
    </>
  );
}
