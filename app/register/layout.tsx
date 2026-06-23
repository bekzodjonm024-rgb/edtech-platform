import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ro'yxatdan o'tish",
  robots: { index: false, follow: true },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
