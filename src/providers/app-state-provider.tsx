"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { MOBILE_BREAKPOINT } from "@/lib/constants";

type AppStateContext =
  | {
      isMobile: boolean;
    }
  | undefined;

const AppStateContext = createContext<AppStateContext>(undefined);

export function AppStateProvider({
  children,
  screenWidth,
}: {
  children: ReactNode;
  screenWidth: number;
}) {
  const isMobile = screenWidth < MOBILE_BREAKPOINT;

  return (
    <AppStateContext.Provider value={{ isMobile }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within a AppStateProvider");
  }
  return context;
}
