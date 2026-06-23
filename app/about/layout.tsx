import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loyiha haqida",
  description:
    "EduAI OS — oliy ta'lim uchun sun'iy intellektga asoslangan o'quv platformasi. " +
    "Loyihaning maqsadi, qiymatlari va jamoasi haqida.",
  alternates: { canonical: "/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
