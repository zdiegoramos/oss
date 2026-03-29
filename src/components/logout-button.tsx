"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <Button onClick={handleLogout} variant="outline">
      Sign out
    </Button>
  );
}
