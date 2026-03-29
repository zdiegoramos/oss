"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isRouteActive, type NavRoutes } from "@/components/nav/config";
import { UserMenu } from "@/components/nav/user-menu";
import { cn } from "@/lib/utils";

export type MobileBottomNavProps = {
  /** Array of navigation routes to display (max 5 icons recommended) */
  routes: NavRoutes;
};

/**
 * Mobile bottom navigation component
 * Displays navigation icons evenly distributed with user menu on the right
 */
export function MobileBottomNav({ routes }: MobileBottomNavProps) {
  const pathname = usePathname();

  // Limit to first 4 routes to make room for user menu (max 5 total items)
  const displayRoutes = routes.slice(0, 4);

  return (
    <nav className="flex h-full w-full touch-none items-center justify-evenly border-border/40 border-t bg-background/95 px-2 backdrop-blur-md">
      {displayRoutes.map((route) => {
        const Icon = route.icon;
        const isActive = isRouteActive(pathname, route.activePatterns);

        return (
          <Link
            aria-current={isActive === true && "page"}
            className={cn(
              "group relative flex flex-1 flex-col items-center justify-center gap-1 py-2",
              "transition-all duration-200 ease-in-out",
              "rounded-lg hover:bg-muted/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "font-semibold text-foreground"
                : "font-medium text-muted-foreground hover:text-foreground"
            )}
            href={route.href}
            key={`mobile-bottom-nav-${route.href}`}
          >
            <Icon
              aria-hidden="true"
              className={cn(
                "size-5 transition-transform duration-200",
                "group-hover:scale-110",
                isActive === true && "scale-105 text-primary"
              )}
            />
            <span className="text-[10px] leading-tight tracking-wide">
              {route.name}
            </span>
            {isActive === true && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
            )}
          </Link>
        );
      })}

      {/* User Menu as the 5th item */}
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <UserMenu />
      </div>
    </nav>
  );
}
