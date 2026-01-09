"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deletePost } from "./actions";

export function DeletePost({ slug }: { slug: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm("Are you sure you want to delete this post?")) {
          startTransition(async () => {
            await deletePost(slug);
          });
        }
      }}
    >
      <Trash2 size={16} className="mr-2" />
      Delete Post
    </Button>
  );
}
