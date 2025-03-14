import { env } from "@/env";

type SupaDataTranscript = {
  content: string;
};

export const fetchYoutubeTranscript = async (
  youtubeUrl: string,
): Promise<string> => {
  const url = new URL("https://api.supadata.ai/v1/youtube/transcript");
  url.searchParams.set("url", youtubeUrl);
  url.searchParams.set("text", "true");

  const response = await fetch(url, {
    next: { revalidate: 0 },
    headers: { "x-api-key": env.SUPADATA_KEY },
  });

  if (!response.ok) {
    const errorText = await response
      .text()
      .catch(() => "Failed to fetch transcript");
    throw new Error(`Failed to fetch transcript: ${errorText}`);
  }

  const transcriptResponse = (await response.json()) as SupaDataTranscript;

  if (!transcriptResponse.content) {
    throw new Error("No transcript found for this video.");
  }

  return transcriptResponse.content;
};
