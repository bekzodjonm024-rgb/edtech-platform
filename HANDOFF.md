# EduAI OS — Project Handoff & Status

> Full context for continuing this project in a new session. Last updated: 2026-06-23.

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
   → Teacher generates AI material (slides / quiz) and SAVES it
   → Teacher ASSIGNS a material to a group (optional deadline)
   → Student sees the assignment, TAKES the quiz / OPENS the presentation
   → Quiz result is SAVED  → Teacher sees per-student SCORES + group average + Reports
```

## 4. Data model (Prisma — `prisma/schema.prisma`)

- **User** — id, email(unique), name, role(`teacher`|`student`), password?(null for OAuth),
  provider(`email`|`google`|`telegram`), providerId?, createdAt
- **Material** — id, userId→User, kind(`presentation`|`quiz`), topic, subject?, data(JSON string), createdAt
- **Group** — id, name, subject?, code(unique), teacherId→User, createdAt
- **Membership** — groupId→Group, studentId→User, joinedAt; `@@unique([groupId, studentId])`
- **Assignment** — groupId→Group, materialId→Material, dueAt?, createdAt; `@@unique([groupId, materialId])`
- **Submission** — assignmentId→Assignment, studentId→User, score(0-100), correct, total, updatedAt; `@@unique([assignmentId, studentId])`
- **TelegramLogin** — token(id), role, tgId?, userId?, authedAt?, consumed, createdAt (pending bot logins)

> Schema changes auto-apply on deploy: the `build` script runs `prisma db push`, so adding a model
> creates its table on the next `vercel deploy`. Adding nullable cols / new tables = no data loss.

## 5. API routes (`app/api/...`)

**Auth**
- `POST /api/auth/register` · `login` · `logout`, `GET /api/auth/me`
- `GET /api/auth/providers` → `{google, telegram, telegramBot}` (UI shows buttons accordingly)
- `GET /api/auth/google` → Google OAuth; `GET /api/auth/google/callback`
- Telegram bot-login: `GET /api/auth/telegram/start` (→ t.me/<bot>?start=token) ·
  `POST /api/telegram/webhook` (bot /start handler) · `GET /api/auth/telegram/complete` (finalise session)
- `GET /api/auth/telegram/callback` — OLD Login Widget route, still present but UNUSED (the bot flow replaced it)

**AI** (graceful mock fallback if no key / error)
- `POST /api/generate` — lesson slides (Claude structured outputs `output_config.format`)
- `POST /api/generate-quiz` — quiz questions (structured)
- `POST /api/tutor` — streaming tutor chat

**Data**
- `GET/POST /api/materials`, `GET/DELETE /api/materials/[id]`
- `GET/POST /api/groups`, `POST /api/groups/join`, `GET/DELETE /api/groups/[id]`
- `GET/POST/DELETE /api/groups/[id]/assignments`
- `POST /api/submissions`, `GET /api/assignments/[id]/submissions`
- `GET /api/stats` (dashboard numbers), `GET /api/reports` (teacher gradebook aggregation)

## 6. Pages (`app/...`)

- Public: `/` (landing), `/login`, `/register`, `/features`, `/about`, `/pricing`, `not-found`
- Dashboard (auth-gated, redirect to `/login` if no session — guard in `DashboardShell`):
  `/demo/teacher`, `/demo/student`, `/demo/generate`, `/demo/lesson`, `/demo/reports`,
  `/demo/tutor`, `/demo/materials`, `/demo/groups`, `/demo/quiz`, `/demo/presentation`, `/demo/view/[id]`

## 7. Key files

- `lib/db.ts` — Prisma singleton
- `lib/auth.ts` — hash/verify, JWT sign/verify, `getSessionUser()`, `setSessionCookie()`, cookie `eduai_session`
- `lib/oauth.ts` — `oauthUpsert()`, `googleEnabled()`, `telegramEnabled()`, `siteOrigin(req)`
- `lib/anthropic.ts` — Claude client, `MODEL`, `hasApiKey()`
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
2. **Rotate the Telegram bot token** — it was pasted in chat (leaked). Steps: @BotFather `/revoke` → new token
   → update `TELEGRAM_BOT_TOKEN` on Vercel → **redeploy** → re-run `setWebhook` with the new token + existing
   `TELEGRAM_WEBHOOK_SECRET` (else Telegram login breaks). The same applies to the **Neon DB password** that
   leaked earlier (reset it in Neon if concerned).
3. **Dashboard widgets still on mock data** (real ones: stat cards on teacher/student, Reports page):
   teacher home "recent lessons" + "assignment status" donut, student "achievements", lesson-page leaderboard.
   Bind these to real data if desired.
4. Ideas raised but not built: settings page (profile/password), notifications (new assignment/deadline),
   custom domain (e.g. eduai.uz), OneID login (needs official org credentials from id.egov.uz — discussed, not built).

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
