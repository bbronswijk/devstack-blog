import { env } from "@/env";
import { prompt } from "@/app/create/prompt";
import JSON5 from "json5";

type GeminiResponse = {
  candidates: { content: { parts: { text: string }[] } }[];
};

export type BlogPost = {
  title: string;
  slug: string;
  topic: string;
  tags: string[];
  content: string;
};

export const generatePostFromTranscript = async (transcript: string) => {
  console.log("performing gemini api call");

  const url = new URL(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  );
  url.searchParams.set("key", env.GEMINI_API_KEY);

  const geminiResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      generationConfig: {
        response_mime_type: "application/json", // Force clean json response
      },
      contents: [
        {
          parts: [
            {
              text: `${prompt}: ${transcript}`,
            },
          ],
        },
      ],
    }),
  });

  console.log("gemini api call done");

  if (!geminiResponse.ok) {
    throw new Error("Failed to generate summary. Please try again later.");
  }

  const geminiData = (await geminiResponse.json()) as GeminiResponse;

  const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

  console.log("Generated text:", text);

  if (!text) {
    throw new Error(
      "Failed to generate summary. The AI model returned an empty response.",
    );
  }

  // JSON5 handles the code examples in the content better.
  return JSON5.parse<BlogPost>(text);
};
