"use client";

import Link from "next/link";
import { Code, Github, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/ui/darkModeToggle";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { data: session } = useSession();

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
          {session ? (
            <UserDropdown />
          ) : (
            <Button size="sm" onClick={() => signIn("google")}>
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

const UserDropdown = () => {
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-8 w-8">
          {session?.user?.image && <AvatarImage src={session?.user?.image} />}
          <AvatarFallback>
            {session?.user?.name ? session.user.name[0] : "A"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{session?.user?.email}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
