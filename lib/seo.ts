// Single source of truth for SEO/site constants.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://edtech-platform-wine.vercel.app";

export const SITE_NAME = "EduAI OS";

export const SITE_DESCRIPTION =
  "Sun'iy intellektga asoslangan oliy ta'lim platformasi: bitta mavzudan ma'ruza, " +
  "taqdimot, test va insho — talaba va professor-o'qituvchilar uchun to'liq o'quv ekotizimi.";
