import { type PropsWithChildren } from "react";

export const ContentSection = ({ children }: PropsWithChildren) => (
  <main className="container mx-auto min-h-screen px-4 pb-40 pt-4 md:pt-20">
    {children}
  </main>
);
