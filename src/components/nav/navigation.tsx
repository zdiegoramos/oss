"use client";

import { AppNavbar } from "@/components/nav/app-navbar";
import {
  ADMIN_NAV_ROUTES,
  type NavRoutes,
  USER_NAV_ROUTES,
} from "@/components/nav/config";
import { MobileBottomNav } from "@/components/nav/mobile-bottom-nav";
import { MobileTopNav } from "@/components/nav/mobile-top-nav";
import { NavbarLinks } from "@/components/nav/navbar-links";
import { WireframeNav } from "@/components/ui/wireframe";
import { useAppState } from "@/providers/app-state-provider";

function Navigation({ routes }: { routes: NavRoutes }) {
  const { isMobile } = useAppState();

  return (
    <>
      {isMobile ? (
        <>
          {/* Mobile: Top nav with logo only */}
          <WireframeNav position="top">
            <MobileTopNav />
          </WireframeNav>

          {/* Mobile: Bottom nav with icons and user menu */}
          <WireframeNav position="bottom">
            <MobileBottomNav routes={routes} />
          </WireframeNav>
        </>
      ) : (
        // Desktop: Top nav with full navbar
        <WireframeNav position="top">
          <AppNavbar>
            <NavbarLinks routes={routes} />
          </AppNavbar>
        </WireframeNav>
      )}
    </>
  );
}

export function UserNavigation() {
  return <Navigation routes={USER_NAV_ROUTES} />;
}

export function AdminNavigation() {
  return <Navigation routes={ADMIN_NAV_ROUTES} />;
}
