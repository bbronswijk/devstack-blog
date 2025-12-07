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

export type ActionState =
  | { success: true; data: BlogPost; error?: never }
  | { success: false; error: string; data?: never };

export async function summarizeVideo(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();

  if (!session) {
    return {
      success: false,
      error: "Unauthorized: You must be logged in to add a video.",
    };
  }

  const youtubeUrl = formData.get("youtubeUrl") as string;

  if (!youtubeUrl || youtubeUrl.trim() === "") {
    return {
      success: false,
      error: "No YouTube URL. Please provide a valid YouTube video URL.",
    };
  }

  // Check if this YouTube URL was already summarized
  const [existingPost] = await db
    .select()
    .from(posts)
    .where(eq(posts.youtubeUrl, youtubeUrl));

  if (existingPost) {
    return {
      success: false,
      error: "This YouTube video has already been summarized.",
    };
  }

  try {
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

    revalidatePath(`/`);

    return { success: true, data: post };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to summarize video. Please try again.",
    };
  }
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
    throw { message: "Could not read transcript from database.", status: 500 };
  }

  return item;
};
