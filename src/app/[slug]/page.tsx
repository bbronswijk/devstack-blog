import Image from "next/image";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import rehypeHighlight from "rehype-highlight";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import readingTime from "reading-time";

export async function generateStaticParams() {
  const slugs = await db.select({ slug: posts.slug }).from(posts);
  return slugs.map(({ slug }) => ({ slug }));
}

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  if (!post) {
    return notFound();
  }

  return (
    <>
      <Image
        className="mx-auto w-full max-w-[1600px] rounded-2xl"
        src={`https://picsum.photos/seed/${slug}/2000/800`}
        alt="Random image"
        width={2000}
        height={800}
      />

      <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 md:py-12 lg:px-8"></div>

      <article className="prose prose-stone mx-auto max-w-3xl dark:prose-invert">
        <h1 className="text-2xl md:text-5xl">{post.title}</h1>
        <span className="flex items-center justify-end gap-1 text-sm">
          <Clock size="14" />
          {readingTime(post.content).text}
        </span>
        <MDXRemote
          source={post.content}
          options={{ mdxOptions: { rehypePlugins: [rehypeHighlight] } }}
        />
        <CTA videoUrl={post.youtubeUrl} />
      </article>
    </>
  );
}

const CTA = ({ videoUrl }: { videoUrl: string }) => (
  <div className="mt-40 justify-center overflow-hidden rounded-xl border p-6">
    <h3 className="mb-2 mt-0 text-xl font-bold">Watch the original video</h3>

    <p className="mb-4 text-muted-foreground">
      This post is based on a YouTube video. Check out the original content for
      more details and visual explanations.
    </p>

    <Link href={videoUrl} target="_blank" rel="noopener noreferrer">
      <Button variant="outline">Watch on YouTube</Button>
    </Link>
  </div>
);
