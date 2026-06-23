# EduAI OS — Project Handoff & Status

> Full context for continuing this project in a new session. Last updated: 2026-06-23
> (added: real-data dashboards, AI essay grading, teacher Analytics, Settings page,
> **security hardening — see §13**).

## 1. What this is

**EduAI OS** — an AI-powered **higher-education** (university, NOT school) learning platform.
Built end-to-end from a single prompt file into a deployed product. Audience terminology is
university: **talaba** (student), **professor-o'qituvchi** (faculty), **guruh** (group/class),
**ma'ruza** (lecture). UI in 3 languages: **uz / en / ru**, plus dark mode.

- **Live site:** https://edtech-platform-wine.vercel.app
- **Vercel project:** `bekzod-s-projects2/edtech-platform` (CLI already authenticated as `bekzodjonm024-2571`)
- **GitHub:** https://github.com/bekzodjonm024-rgb/edtech-platform (push works via cached credential)
- **Local path:** `C:\Users\bekzo\Downloads\edtech-platform`

## 2. Tech stack (pinned for reasons — don't blindly upgrade)

- **Next.js 15.5** (App Router). NOT 16 (needs eslint 9). NOT < 15.2 (Vercel blocks for a CVE).
- **React 18.3.1**, TypeScript, **TailwindCSS 3**, framer-motion, lucide-react, next-themes.
- **Prisma 6** + **PostgreSQL (Neon)**. NOT Prisma 7 (breaking `url`-in-schema config change).
- Auth: **bcryptjs** (password hash) + **jose** (JWT) in an httpOnly cookie. No NextAuth.
- AI: **@anthropic-ai/sdk**, model `claude-opus-4-8` (override via `ANTHROPIC_MODEL`).

## 3. The complete user flow (all real, all live)

```
Sign up / log in  (Email · Google · Telegram)
   → Teacher creates a GROUP  → gets a 6-char invite code (e.g. MOL-ELF9E)
   → Student JOINS by code
   → Teacher generates AI material (slides / quiz / essay) and SAVES it
   → Teacher ASSIGNS a material to a group (optional deadline)
   → Student sees the assignment, TAKES the quiz / OPENS the presentation /
     WRITES an essay → Claude grades it (strengths, improvements, score)
   → Result is SAVED  → Teacher sees per-student SCORES + group average + Reports + Analytics
```

## 4. Data model (Prisma — `prisma/schema.prisma`)

- **User** — id, email(unique), name, role(`teacher`|`student`), password?(null for OAuth),
  provider(`email`|`google`|`telegram`), providerId?, createdAt
- **Material** — id, userId→User, kind(`presentation`|`quiz`|`essay`), topic, subject?, data(JSON string), createdAt
- **Group** — id, name, subject?, code(unique), teacherId→User, createdAt
- **Membership** — groupId→Group, studentId→User, joinedAt; `@@unique([groupId, studentId])`
- **Assignment** — groupId→Group, materialId→Material, dueAt?, createdAt; `@@unique([groupId, materialId])`
- **Submission** — assignmentId→Assignment, studentId→User, score(0-100), correct, total,
  **content?** (essay answer text), **feedback?** (JSON AI evaluation), updatedAt; `@@unique([assignmentId, studentId])`
- **TelegramLogin** — token(id), role, tgId?, userId?, authedAt?, consumed, createdAt (pending bot logins)
- **RateLimit** — key(id), count, expires — fixed-window counters for the rate limiter (§13). Swept opportunistically.

> Schema changes auto-apply on deploy: the `build` script runs `prisma db push`, so adding a model
> creates its table on the next `vercel deploy`. Adding nullable cols / new tables = no data loss.

## 5. API routes (`app/api/...`)

**Auth**
- `POST /api/auth/register` · `login` · `logout`, `GET /api/auth/me`
- `GET /api/auth/providers` → `{google, telegram, telegramBot}` (UI shows buttons accordingly)
- `GET /api/auth/google` → Google OAuth; `GET /api/auth/google/callback`
- Telegram bot-login: `GET /api/auth/telegram/start` (→ t.me/<bot>?start=token) ·
  `POST /api/telegram/webhook` (bot /start handler) · `GET /api/auth/telegram/complete` (finalise session)
- `GET /api/telegram/setup?secret=<TELEGRAM_WEBHOOK_SECRET>` — (re)registers the webhook using the
  server-env bot token (use after rotating `TELEGRAM_BOT_TOKEN`; token never leaves the server)
- `GET /api/auth/telegram/callback` — OLD Login Widget route, still present but UNUSED (the bot flow replaced it)

**AI** (graceful mock fallback if no key / error)
- `POST /api/generate` — lesson slides (Claude structured outputs `output_config.format`)
- `POST /api/generate-quiz` — quiz questions (structured)
- `POST /api/generate-essay` — essay prompt + guidance + rubric (structured)
- `POST /api/submissions/essay` — student essay answer → Claude grades vs rubric → stores `content`+`feedback`+score
- `POST /api/tutor` — streaming tutor chat

**Data**
- `GET/POST /api/materials`, `GET/DELETE /api/materials/[id]`
- `GET/POST /api/groups`, `POST /api/groups/join`, `GET/DELETE /api/groups/[id]`
- `GET/POST/DELETE /api/groups/[id]/assignments`
- `POST /api/submissions` (quiz), `GET /api/assignments/[id]/submissions`
- `GET /api/my/assignments` (student's assignments + own submission status),
  `GET /api/my/assignments/[id]` (one assignment + material payload + own submission)
- `GET /api/stats` (dashboard numbers + widget data), `GET /api/reports` (teacher gradebook),
  `GET /api/analytics` (metrics, distribution, timeline, per-student progress)

**Account/settings**
- `GET/PATCH /api/auth/profile` — read account meta (hasPassword, provider) / update name (re-signs cookie)
- `POST /api/auth/password` — change password (or set one for OAuth-only accounts)

## 6. Pages (`app/...`)

- Public: `/` (landing), `/login`, `/register`, `/features`, `/about`, `/pricing`, `not-found`
- Dashboard (auth-gated, redirect to `/login` if no session — guard in `DashboardShell`):
  `/demo/teacher`, `/demo/student`, `/demo/generate`, `/demo/lesson`, `/demo/reports`,
  `/demo/analytics` (teacher analytics), `/demo/settings` (profile + password, both roles),
  `/demo/tutor`, `/demo/materials`, `/demo/groups`, `/demo/quiz`, `/demo/presentation`,
  `/demo/view/[id]`, `/demo/essay/[id]` (student essay: prompt + answer + AI feedback)

## 7. Key files

- `lib/db.ts` — Prisma singleton
- `lib/auth.ts` — hash/verify, JWT sign/verify, `getSessionUser()`, `setSessionCookie()`, cookie `eduai_session`
- `lib/oauth.ts` — `oauthUpsert()`, `googleEnabled()`, `telegramEnabled()`, `siteOrigin(req)`
- `lib/anthropic.ts` — Claude client, `MODEL`, `hasApiKey()`
- `lib/validation.ts` — `parseJson(req, schema)` (zod) + shared `emailSchema`/`passwordSchema` (§13)
- `lib/rate-limit.ts` — `rateLimit()` / `rateLimitResponse()`, Postgres-backed durable limiter (§13)
- `lib/i18n/` — `context.tsx` (provides `t`, `d`, `s`), `dictionaries.ts` (landing), `dash-dictionaries.ts`,
  `screens-dictionaries.ts`, `auth-strings.ts`, `group-strings.ts`
- `components/dashboard/` — `dashboard-shell.tsx` (sidebar+topbar+auth guard), `sidebar.tsx`, `topbar.tsx`, `stat-card.tsx`
- `components/auth/social-logins.tsx` — Google + Telegram buttons (shown only when configured)
- `lib/mock-data.ts` — demo data still used by some dashboard widgets (see §10)

## 8. Environment variables (set on Vercel — Production)

| Var | Purpose |
|---|---|
| `DATABASE_URL` / `DATABASE_URL_UNPOOLED` | Neon Postgres (pooled / direct). Set by the Vercel→Neon integration. `directUrl` in schema = `DATABASE_URL_UNPOOLED`. |
| `AUTH_SECRET` | JWT signing secret |
| `ANTHROPIC_API_KEY` | Claude — **key is set but the account needs CREDITS** (currently low → AI 500s → client falls back to mock). |
| `NEXT_PUBLIC_SITE_URL` | `https://edtech-platform-wine.vercel.app` (used to build OAuth redirect URLs) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth (redirect URI registered: `…/api/auth/google/callback`) |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_BOT_USERNAME` | Bot `eduai_os_bot` |
| `TELEGRAM_WEBHOOK_SECRET` | Verifies Telegram webhook calls; also passed to `setWebhook` |

> ⚠️ Production env values are NOT readable back via `vercel env pull` (encrypted → blank). Set/edit
> them in the Vercel dashboard or via `vercel env add` (pipe value via stdin).

## 9. Deploy & dev workflow

**Deploy** (from project dir, CLI is authenticated):
```bash
vercel deploy --prod --yes   # builds remotely; runs prisma db push + next build; ~1 min
```
- Deploying from local does NOT require a git push (CLI uploads the dir). Still push to keep git synced.
- `git push origin main` works (cached credential). Use `GIT_TERMINAL_PROMPT=0` to avoid hangs.
- Production alias: `edtech-platform-wine.vercel.app` (Deployment Protection is OFF = public).
- Gotcha: `vercel env add` can exit non-zero even on success — don't chain it with `&&`.

**Local dev** (now requires Postgres, not SQLite):
```bash
# .env needs DATABASE_URL + DATABASE_URL_UNPOOLED (Neon) + AUTH_SECRET
npm install
npm run db:push   # sync schema to the DB
npm run dev
```

## 10. Pending / TODO (next-session candidates)

1. **Anthropic credits** — add at console.anthropic.com → Billing to flip AI from mock to real (no code change).
2. ✅ **DONE — Telegram bot token rotated + webhook secret reset** (2026-06-23). The old leaked token was
   `/revoke`d in @BotFather; the new one set on Vercel as a **sensitive** env (`TELEGRAM_BOT_TOKEN`,
   Production). `TELEGRAM_WEBHOOK_SECRET` was **also regenerated** — it had drifted out of sync with the
   value registered on Telegram's side, and the webhook handler **silently drops** any update whose
   `x-telegram-bot-api-secret-token` header ≠ env secret, so the bot looked dead. Fix: set the same fresh
   value in the env AND via `setWebhook` `secret_token`, then redeploy. Helper route does the registration
   without exposing the token: `GET /api/telegram/setup?secret=<TELEGRAM_WEBHOOK_SECRET>` (calls `setWebhook`
   + returns `getWebhookInfo`). Verified: login works end-to-end.
   ⚠️ Gotcha for next time: if the bot goes silent, the **secret_token mismatch** is the usual cause — check
   `getWebhookInfo` via the setup route and confirm env `TELEGRAM_WEBHOOK_SECRET` matches.
   ⚠️ Still pending: the **Neon DB password** that leaked earlier — reset it in Neon if concerned.
3. ✅ **DONE — Dashboard widgets bound to real data.** Teacher home (recent lessons, assignment-status
   donut), student home (points, achievements, progress ring, assignments list) all use real DB data now,
   with loading skeletons + shape validation (fixed the old "undefined" stat-card bug). Still on mock:
   `/demo/lesson` leaderboard + that page's widgets (cosmetic demo page).
4. ✅ **DONE — Settings page** (`/demo/settings`): change name + password (OAuth-only accounts can set one).
5. ✅ **DONE — AI essay grading**: teacher generates essays (Generate page → "Uy vazifasi"/homework),
   assigns them; student writes an answer at `/demo/essay/[id]`; Claude grades vs rubric and returns
   strengths/improvements/score. Needs Anthropic credits for real grading (graceful "teacher will review" fallback otherwise).
6. ✅ **DONE — Teacher Analytics** (`/demo/analytics`): metrics, grade-distribution donut, results-timeline
   line chart, per-student progress table, rule-based insights (no AI credits needed).
7. ✅ **DONE — Per-assignment quiz flow** (`/demo/quiz/[id]`): fetches real assignment data,
   shows questions from DB, submits score to `/api/submissions`, shows previous submission on reload.
   Student dashboard link updated from `/demo/quiz` → `/demo/quiz/${a.id}`.
8. ✅ **DONE — Notifications**: `Notification` model in DB; teacher assigning material fans out
   `new_assignment` notifications to all group members; `GET /api/notifications` also returns
   computed `deadline_soon` alerts (dueAt within 48h, not yet submitted). Topbar bell shows live
   unread badge + dropdown panel (uz/en/ru), marks all read on open. `POST /api/notifications` marks stored records read.
9. ✅ **DONE — Quiz review screen**: after submitting, result screen shows "Javoblarni ko'rish"
   button. Review lists every question with student's answer highlighted green (correct) or
   red (wrong), correct answer marked, skipped questions noted. Answers stored as JSON in
   `Submission.answers` so review works on reload too (uz/en/ru).
10. ✅ **DONE — Admin panel** (`/admin`): role-gated (admin only), server-side redirect for others.
    Pages: Dashboard (stats + recent activity), Users (search/filter/role change/delete),
    Groups (list/delete), Materials (filter by kind/delete). Guard: `lib/admin-guard.ts`.
    Setup: `ADMIN_SETUP_SECRET` + `ADMIN_EMAIL` set on Vercel; call
    `GET /api/admin/setup?secret=...` once. bekzodjonm024@gmail.com is now admin.
11. Still not built: custom domain (e.g. eduai.uz),
    OneID login (needs official org credentials from id.egov.uz).

## 11. Test accounts (live)

- Teacher: `ustoz@univ.uz` / `ustoz123` (owns group **201-guruh**, code **MOL-ELF9E**, has a graded quiz)
- Student: `sinov@univ.uz` / `sinov123` (member of 201-guruh)

## 12. Critical gotchas (read before changing things)

- **The Neon DB is SEPARATE from the Kasb Tanla project.** A near-miss happened where the Kasb Tanla
  production DB connection string was almost wiped by `prisma db push`. Never point this project at it.
- New Google/Telegram users default to role **student** (register page passes the chosen role; login defaults to student).
- Google flow has NO `prompt=select_account` → already-signed-in users auto-login (intentional, smoother).
- Telegram uses a **bot /start deep-link** (no phone prompt), NOT the Login Widget. Webhook must point at
  `…/api/telegram/webhook`; if you rotate the token you MUST re-call `setWebhook`.

## 13. Security hardening (added 2026-06-23)

- **Input validation** — `lib/validation.ts` `parseJson(req, schema)` validates every mutating route body
  with **zod** (was installed but unused). On bad input → `400 {error:"invalid_input"|"invalid_json"}`.
  Legacy error codes the client special-cases are preserved (`email_taken`, `weak_password`,
  `invalid_credentials`, `missing_code`, `password_too_short`, …).
- **Rate limiting** — `lib/rate-limit.ts`, **Postgres-backed fixed window** via the `RateLimit` table.
  In-memory was tried first but never fired on Vercel (per-instance memory) — confirmed live. Keyed by
  user id when authenticated, else client IP. **Fails open** if the DB hiccups. Returns `429
  {error:"rate_limited",retryAfter}` + `Retry-After` header. Limits/min: login 10, register 5, password 10,
  groups/join 20, AI generate* 15, tutor 30, essay-grade 20. To swap to Upstash Redis later, only this file
  changes (signatures stay). Verified live: 11th rapid login → 429.
- **Auth gates added to AI routes** — `generate`, `generate-quiz`, `generate-essay`, `tutor` previously had
  **no auth** (anyone could burn Claude credits). Now require a session (`getSessionUser`) → `401` otherwise.
- **Security headers** — `next.config.mjs` `headers()` sets **CSP** (`default-src 'self'`; scripts/styles
  keep `'unsafe-inline'` because Next injects un-nonced inline scripts + framer-motion inline styles),
  **HSTS**, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`.
  ⚠️ If you add a 3rd-party script/CDN/iframe, update the CSP or it'll be blocked. Tightening to nonce-based
  scripts (drop `'unsafe-inline'`) needs middleware — a future task.

## 14. SEO baseline (added 2026-06-23)

- `lib/seo.ts` — shared `SITE_URL` / `SITE_NAME` / `SITE_DESCRIPTION` (single source of truth).
- **Root metadata** (`app/layout.tsx`): `metadataBase`, title template `"%s — EduAI OS"`, default
  description/keywords, canonical, OpenGraph + Twitter card, `robots` (index/follow). Lang is `uz`.
- **Metadata-route files**: `app/robots.ts` (allow all, disallow `/api/ /demo/ /login /register`, points to
  sitemap), `app/sitemap.ts` (4 public routes: `/ /features /pricing /about`), `app/manifest.ts`
  (PWA basics, theme `#7c5cff`, uses `public/favicon.svg`), `app/opengraph-image.tsx` (branded 1200×630 PNG
  via `next/og` — auto-wired into OG + Twitter for every route).
- **Per-page metadata**: `features` exports `metadata` (server component). `about` + `pricing` get indexable
  titles via a route-folder `layout.tsx`; `login` + `register` layouts set `robots: { index:false }`.
  ⚠️ The client-component pages can't export `metadata` themselves — that's why the layout wrappers exist.
- **JSON-LD** on the landing page (`app/page.tsx`): Organization + WebSite + SoftwareApplication graph.
- Verified live: robots.txt, sitemap.xml, manifest.webmanifest, /opengraph-image (PNG), landing JSON-LD,
  `/features` → `<title>Imkoniyatlar — EduAI OS</title>`.

## 15. Design-system primitives (added 2026-06-23)

`components/ui/` previously had only `button`, `card`, `badge`. Added 11 reusable primitives in the same
style (`cn` from `lib/utils`, `forwardRef`, brand tokens `primary`/`secondary`, `rounded-xl/2xl`/`rounded-pill`,
`shadow-card/lift`, dark-mode variants, `focus-visible:ring-primary`):

- **Static** (no `"use client"`): `input.tsx` (`Input` / `Textarea` / `Label`), `skeleton.tsx`,
  `spinner.tsx` (`Spinner` + `LoadingState`), `empty-state.tsx` (`EmptyState`, takes a lucide icon),
  `avatar.tsx` (initials fallback + image), `table.tsx` (`Table`/`THead`/`TBody`/`TR`/`TH`/`TD`).
- **Interactive** (`"use client"`): `tabs.tsx` (context-based `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent`,
  controlled or uncontrolled), `tooltip.tsx`, `dropdown.tsx` (`Dropdown` + `DropdownItem`, outside-click +
  Esc close), `modal.tsx` (portal, Esc + backdrop close, body-scroll lock), `toast.tsx`.
- **Toast usage**: `<Toaster>` is wired into `app/providers.tsx` (innermost), so any client component can do
  `const { toast } = useToast(); toast({ type: "success", message: "…" })`. Types: success/error/info,
  auto-dismiss 4s. Uses the existing `animate-fade-up` keyframe.
- **Adopted so far**: `login`, `register`, `demo/settings` use `Input`/`Label` (replaced duplicated
  hand-rolled `field`/`label` classes); `settings` uses `useToast()` for save feedback. `demo/groups` uses
  `Input` + `EmptyState` + `Toast`, and **group deletion now requires a confirmation `Modal`** (was instant
  & irreversible with no prompt — added `deleteTitle`/`deleteConfirm`/`cancel` i18n keys uz/en/ru).
  Remaining pages (materials, generate, dashboards) still use ad-hoc markup — adopt incrementally (low risk).
