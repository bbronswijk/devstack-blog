import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Strip URL of any unnecessary parameters like the list index etc.
 *
 * @Example:
 * https://www.youtube.com/watch?v=5QP0mvrJkiY&list=WL&index=2
 * Becomes
 * https://www.youtube.com/watch?v=5QP0mvrJkiY
 */
export const sanitizedYoutubeUrl = (url: string) => {
  const urlObj = new URL(url);
  return `${urlObj.origin}${urlObj.pathname}?v=${urlObj.searchParams.get("v")}`;
};
