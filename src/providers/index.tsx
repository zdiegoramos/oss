"use client";

import { AppStateProvider } from "@/providers/app-state-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppStateProvider>{children}</AppStateProvider>;
}
