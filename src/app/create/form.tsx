"use client";

import type React from "react";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Youtube } from "lucide-react";
import { summarizeVideo, type ActionState } from "./actions";
import { redirect, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const initialState: ActionState | null = null;

export function Form() {
  const router = useRouter();
  const { data, error, isPending: isPendingAuth } = authClient.useSession();
  const [state, formAction, isPending] = useActionState(
    summarizeVideo,
    initialState,
  );

  // Redirect on success
  useEffect(() => {
    if (state?.success && state.data) {
      router.push(`/${state.data.slug}`);
    }
  }, [state, router]);

  if (isPendingAuth) {
    return <p>Loading...</p>;
  }

  if (!data || error) {
    return redirect("/");
  }

  return (
    <Card className="mx-auto mb-10 max-w-[800px]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Youtube className="h-6 w-6 text-red-600" />
          <CardTitle>YouTube Video Summarizer</CardTitle>
        </div>
        <CardDescription>
          Enter a YouTube URL to get an AI-generated summary of the video
          content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="text"
              name="youtubeUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1"
              required
              disabled={isPending}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                "Summarize"
              )}
            </Button>
          </div>

          {state && !state.success && state.error && (
            <div className="rounded-md bg-red-50 p-4 text-red-600 dark:bg-red-950/50 dark:text-red-400">
              {state.error}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
