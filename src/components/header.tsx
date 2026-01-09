import Link from "next/link";
import { Code, Github, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/ui/darkModeToggle";
import { authClient } from "@/lib/auth-client";
import { UserDropdown } from "@/components/UserDropdown";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex h-16 items-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          <span className="inline-block text-xl font-bold">DevStack</span>
        </Link>

        <div className="flex items-center gap-4">
          {session && (
            <Link href="/create" className="md:mr-10">
              <Button variant="outline" className="hidden md:block">
                Create New Post
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="flex justify-center md:hidden"
              >
                <Plus />
              </Button>
            </Link>
          )}
          {session?.user ? (
            <UserDropdown user={session.user} />
          ) : (
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
          )}
          <DarkModeToggle />
          <Link
            href="https://github.com/bbronswijk/devstack-blog"
            target="_blank"
          >
            <Github className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
