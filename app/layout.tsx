import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduAI OS — One Topic, a Complete Learning Ecosystem",
  description:
    "AI-powered higher-education platform that turns a single topic into complete learning materials for university faculty and students.",
  keywords: ["EdTech", "AI education", "presentations", "quizzes", "EduAI OS"],
  openGraph: {
    title: "EduAI OS",
    description: "One topic — a complete learning ecosystem.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
