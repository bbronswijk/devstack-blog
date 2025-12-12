import { env } from "@/env";
import { prompt } from "@/app/create/prompt";
import JSON5 from "json5";
import { GoogleGenAI } from "@google/genai";

export type BlogPost = {
  title: string;
  slug: string;
  topic: string;
  tags: string[];
  content: string;
};

const ai = new GoogleGenAI({});

export const generatePostFromTranscript = async (transcript: string) => {
  console.log("performing gemini api call");

  const url = new URL(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  );
  url.searchParams.set("key", env.GEMINI_API_KEY);

  const geminiResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${prompt}: ${transcript}`,
    config: {
      responseMimeType: "application/json", // Force clean json response
    },
  });

  const text = geminiResponse.text;

  console.log("Generated text:", text);

  if (!text) {
    throw new Error(
      "Failed to generate summary. The AI model returned an empty response.",
    );
  }

  // JSON5 handles the code examples in the content better.
  return JSON5.parse<BlogPost>(text);
};
