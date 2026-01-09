import Link from "next/link";
import Image from "next/image";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { desc } from "drizzle-orm";
import { format } from "date-fns";
import readingTime from "reading-time";
import { Clock } from "lucide-react";
import { Hero } from "@/components/hero";
import { ContentSection } from "@/components/section";

export default async function HomePage() {
  const blogPosts = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.updatedAt));

  if (blogPosts.length === 0) {
    return <NoPosts />;
  }

  const heroPost = blogPosts[0];

  return (
    <>
      {heroPost && <Hero post={heroPost} />}

      <ContentSection>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(480px,100%),1fr))] gap-6">
          {blogPosts.slice(1).map((post) => (
            <Link key={post.id} href={`/${post.slug}`}>
              <Card key={post.id} className="flex h-full flex-col">
                {post.thumbnailUrl && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.thumbnailUrl}
                      alt={post.title}
                      width={500}
                      height={190}
                      className="min-h-full min-w-full rounded-t-lg object-cover"
                    />
                  </div>
                )}
                <CardContent className="flex flex-grow flex-col pt-6">
                  <h2 className="mb-2 text-xl font-semibold">{post.title}</h2>

                  <div className="mb-4 flex justify-between text-muted-foreground">
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
                  <div className="mb-10 flex flex-wrap gap-2">
                    {post.tags?.split(",").map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-auto font-medium text-primary">
                    Read more →
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </ContentSection>
    </>
  );
}

const NoPosts = () => (
  <div className="py-10 text-center">
    <h2 className="text-xl font-medium text-muted-foreground">No posts yet</h2>
    <p className="mt-2 text-muted-foreground">
      Create your first post to get started.
    </p>
  </div>
);
