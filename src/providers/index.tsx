"use client";

import { useWindowSize } from "@uidotdev/usehooks";
import { AppStateProvider } from "@/providers/app-state-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const size = useWindowSize();

  const width = size.width;

  if (!width) {
    return null; // or a loading indicator
  }

  return <AppStateProvider screenWidth={width}>{children}</AppStateProvider>;
}
