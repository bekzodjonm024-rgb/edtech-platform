import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Narxlar",
  description:
    "EduAI OS tarif rejalari — universitetlar, professor-o'qituvchilar va talabalar uchun " +
    "moslashuvchan narxlar.",
  alternates: { canonical: "/pricing" },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
