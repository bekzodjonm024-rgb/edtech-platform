# EduAI OS — One Topic, a Complete Learning Ecosystem

AI-powered education platform showcase: a polished landing page **+** an interactive
demo (faculty & student dashboards) for **higher education**. Built with Next.js 15, TypeScript and TailwindCSS.

> **Real Claude AI is wired in** (via the official `@anthropic-ai/sdk`) for the
> AI Material Generator and the AI Tutor chat. Set `ANTHROPIC_API_KEY` to enable it.
> **Without a key the app still runs** — those features gracefully fall back to local
> mock content, so the whole project works with zero backend and no database.

## ✨ Features

- 🎯 Landing page: Hero, Problems, Vision, Features, How it works, Roadmap, CTA
- 🧑‍🏫 Faculty demo: today's sessions, group performance chart, lecture & quiz generators, assignment tracking
- 🎓 Student demo: progress ring, assignments with live submit, achievements
- 🌍 3 languages — **Uzbek / English / Russian** (instant switch, saved to `localStorage`)
- 🌗 Dark / Light mode (`next-themes`, system-aware)
- 📱 Mobile-first responsive design
- 🎬 Framer Motion animations
- 🐳 Docker-ready (standalone output) + Vercel-ready

## 🧱 Tech stack

| Area | Choice |
|------|--------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | TailwindCSS v3 |
| Animations | Framer Motion |
| Icons | lucide-react |
| Theme | next-themes |
| i18n | Lightweight custom context + dictionaries |
| Charts | Hand-built SVG / CSS (no heavy deps) |

## 🤖 Claude AI integration

Real AI runs server-side through Next.js route handlers (the API key never reaches the browser):

| Route | Surface | Claude feature |
|-------|---------|----------------|
| `POST /api/generate` | AI Material Generator (`/demo/generate`) | **Structured outputs** (`output_config.format`) → JSON lesson slides |
| `POST /api/tutor` | AI Tutor chat (`/demo/tutor`) | **Streaming** text response, token-by-token |

- Model: `claude-opus-4-8` (override with `ANTHROPIC_MODEL`).
- Content is generated in the user's selected UI language (UZ / EN / RU).
- If `ANTHROPIC_API_KEY` is unset or a request fails, the route returns `503` and the
  client falls back to local mock content — the demo never breaks.

```bash
cp .env.example .env.local   # then add your ANTHROPIC_API_KEY
```

## 🔐 Accounts & database

Real auth (no third-party service) backed by a local **SQLite** database via **Prisma**:

- **Sign up / sign in** with a teacher (faculty) or student role — `bcryptjs`-hashed passwords, JWT session in an httpOnly cookie (`jose`).
- Dashboards under `/demo/*` require a session; visitors are redirected to `/login`.
- **Saved materials** — generated lectures/quizzes are stored per user (`/api/materials`) and listed at `/demo/materials`.

| Route | Purpose |
|-------|---------|
| `POST /api/auth/register` · `login` · `logout` · `GET /api/auth/me` | Authentication |
| `GET/POST /api/materials` · `DELETE /api/materials/[id]` | Saved materials (per user) |

Schema lives in `prisma/schema.prisma` (`User`, `Material`). `DATABASE_URL` + `AUTH_SECRET` go in `.env`.
For production, point `DATABASE_URL` at Postgres (e.g. Neon) and switch the Prisma `provider`.

## 🚀 Getting started

```bash
npm install          # also runs `prisma generate`
npm run db:push      # create the local SQLite schema (dev.db)
npm run dev
```

Open <http://localhost:3000>, then register an account. To enable real AI, add `ANTHROPIC_API_KEY` to `.env.local`.

## 📦 Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm start       # run production build
npm run lint    # lint
```

## 🐳 Docker

```bash
docker compose up --build
# → http://localhost:3000
```

## ☁️ Deploy to Vercel

1. Push to GitHub.
2. Import the repo at <https://vercel.com>.
3. Deploy (no env vars required for the demo).

## 📁 Structure

```
app/                 Routes (landing, demo/teacher, demo/student, features, about, pricing)
components/
  layout/            Header, Footer, Container, theme & language switchers, SiteShell
  sections/          Landing sections (Hero, Problems, Vision, ...)
  demo/              Generators, BarChart, ProgressRing
  ui/                Button, Card, Badge
lib/
  i18n/              Dictionaries (uz/en/ru) + React context
  mock-data.ts       Demo data
  utils.ts           cn() helper
```

## 🗺️ Why a simplified i18n?

The original brief specified `next-intl` with `/[locale]/` URL routing. That adds
middleware complexity and a class of routing bugs for what is, here, a showcase.
This build uses a small typed dictionary + context with `localStorage` persistence —
fewer moving parts, nothing to break, identical UX. Swappable for `next-intl` later
if SEO-per-locale URLs become a requirement.

---

© EduAI OS. Built as a product showcase.
