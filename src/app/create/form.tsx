"use client";

import type React from "react";

import { useState } from "react";
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
import { summarizeVideo } from "./actions";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function Form() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return redirect("/");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { slug } = await summarizeVideo(url);
      router.push(`/${slug}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to summarize video",
      );
    } finally {
      setLoading(false);
    }
  };

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit" disabled={loading || !url}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                "Summarize"
              )}
            </Button>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 text-red-600">{error}</div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
