"use server";

import { db } from "@/server/db";
import { posts, transcripts } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { sanitizedYoutubeUrl } from "@/lib/utils";
import { fetchYoutubeTranscript } from "@/lib/transcript.api";
import {
  type BlogPost,
  generatePostFromTranscript,
} from "@/lib/generate-post.api";

import { auth } from "@/server/auth";
import { revalidatePath } from "next/cache";

export async function summarizeVideo(youtubeUrl: string): Promise<BlogPost> {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized: You must be logged in to add a video.");
  }

  if (!youtubeUrl) {
    throw new Error(
      "No YouTube URL. Please provide a valid YouTube video URL.",
    );
  }

  const { content } = await getTranscript(sanitizedYoutubeUrl(youtubeUrl));

  const post = await generatePostFromTranscript(content);

  await db.insert(posts).values({
    title: post.title,
    slug: post.slug,
    topic: post.topic,
    tags: post.tags?.join(","),
    content: post.content,
    youtubeUrl,
    thumbnailUrl: `https://picsum.photos/seed/${post.slug}/2000/800`,
  });

  revalidatePath(`/${post.slug}`);

  return post;
}

/**
 * Fetch transcript from Supadata API
 */
const getTranscript = async (youtubeUrl: string) => {
  // Check in the database first whether we did not already fetch this transcript
  const [cachedContent] = await db
    .select()
    .from(transcripts)
    .where(eq(transcripts.youtubeUrl, youtubeUrl));

  if (cachedContent) {
    return cachedContent;
  }

  const content = await fetchYoutubeTranscript(youtubeUrl);

  const [item] = await db
    .insert(transcripts)
    .values({ content, youtubeUrl })
    .returning();

  if (!item) {
    throw new Error("Could not read transcript from database.");
  }

  return item;
};
