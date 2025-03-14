import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import NextAuthProvider from "@/lib/SessionProvider";
import { ThemeProvider } from "@/lib/ThemeProvider";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "DevStack blog",
  description: "AI generated posts based on youtube transcripts",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <Header />
            <main className="container mx-auto min-h-screen px-4 pb-40 pt-4 md:pt-20">
              {children}
            </main>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
