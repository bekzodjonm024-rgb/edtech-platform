import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EduAI OS — Bitta mavzudan to'liq o'quv ekotizimi",
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "EduAI OS",
    "sun'iy intellekt ta'lim",
    "oliy ta'lim platformasi",
    "AI ma'ruza generator",
    "test generator",
    "EdTech",
    "AI education",
  ],
  authors: [{ name: SITE_NAME }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: "EduAI OS — Bitta mavzudan to'liq o'quv ekotizimi",
    description: SITE_DESCRIPTION,
    locale: "uz_UZ",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduAI OS — Bitta mavzudan to'liq o'quv ekotizimi",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
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
