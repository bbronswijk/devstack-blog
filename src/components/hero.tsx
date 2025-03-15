import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { type posts } from "@/server/db/schema";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import readingTime from "reading-time";

type HeroPost = typeof posts.$inferSelect;

export function Hero({ post }: { post: HeroPost }) {
  return (
    <div className="relative w-full bg-muted/80">
      <div className="container mx-auto px-4 py-12">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {post.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              {post.tags?.split(",").map((tag) => (
                <Badge key={tag} variant="default" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex gap-8 pb-12 text-muted-foreground">
              {post.updatedAt && (
                <time className="t block text-sm">
                  {format(new Date(post.updatedAt), "MMMM dd, yyyy")}
                </time>
              )}
              <span className="flex items-center gap-1 text-sm">
                <Clock size="14" />
                {readingTime(post.content).text}
              </span>
            </div>

            <Button asChild size="lg" className="w-full md:w-auto">
              <Link href={`/${post.slug}`}>Read Now</Link>
            </Button>
          </div>
          <div className="relative hidden h-[300px] overflow-hidden rounded-lg md:block md:h-[400px]">
            {post.thumbnailUrl && (
              <Image
                src={post.thumbnailUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
