"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function LoginButton() {
  return (
    <Button
      size="sm"
      onClick={() =>
        authClient.signIn.social({
          provider: "google",
        })
      }
    >
      Login
    </Button>
  );
}
