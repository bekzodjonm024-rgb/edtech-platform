# Deploying EduAI OS to Vercel (with Neon Postgres)

This app uses **Prisma + PostgreSQL**. For production we use **Neon** (serverless Postgres),
which gives a *pooled* connection string that works well on Vercel's serverless runtime.

You'll set up the database once, point both your local machine and Vercel at it, then deploy.

---

## 1. Create a Neon database

1. Go to <https://neon.tech> → sign in → **Create project** (pick a region near your users).
2. Open the project → **Connection Details**.
3. You need **two** connection strings:
   - **Pooled** — the dropdown has a *"Pooled connection"* toggle **on**. The host contains
     `-pooler` (e.g. `ep-cool-name-pooler.eu-central-1.aws.neon.tech`). → this is `DATABASE_URL`.
   - **Direct** — toggle *"Pooled connection"* **off**. Host has **no** `-pooler`. → this is `DIRECT_URL`.
4. Make sure both end with `?sslmode=require`.

> Why two? The app runs on serverless and must use the **pooled** URL (`DATABASE_URL`).
> Schema changes (`prisma db push`) need a **direct** URL (`DIRECT_URL`) — pgBouncer can't run DDL.

---

## 2. Configure locally and create the tables

Edit `.env` (already scaffolded — replace the placeholders):

```env
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxx-pooler.REGION.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@ep-xxxx.REGION.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="<paste a strong secret>"
```

Generate a strong `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

Create the `User` / `Material` tables in Neon:

```bash
npm run db:push
```

(Optional) enable real Claude AI locally — add to `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

Run it:

```bash
npm run dev
```

---

## 3. Push the code to GitHub

```bash
git init
git add .
git commit -m "EduAI OS"
git branch -M main
git remote add origin https://github.com/<you>/edtech-platform.git
git push -u origin main
```

> `.env`, `.env.local`, `node_modules`, and `dev.db` are already in `.gitignore` — secrets are not committed.

---

## 4. Import to Vercel

1. <https://vercel.com> → **Add New… → Project** → import your GitHub repo.
2. Framework preset is auto-detected as **Next.js**. Leave Build/Install commands as default
   (the `build` script already runs `prisma generate && next build`).
3. Add **Environment Variables** (Production + Preview):

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | Neon **pooled** URL |
   | `DIRECT_URL` | Neon **direct** URL |
   | `AUTH_SECRET` | your `openssl rand -base64 32` value |
   | `ANTHROPIC_API_KEY` | *(optional)* your Claude key — omit to run in mock mode |
   | `ANTHROPIC_MODEL` | *(optional)* defaults to `claude-opus-4-8` |

4. Click **Deploy**.

That's it — open the deployment URL and register an account.

---

## Notes & troubleshooting

- **Tables missing in production?** Run `npm run db:push` locally (it targets the same Neon DB
  via `DIRECT_URL`). The app and Vercel share that one database.
- **`PrismaClientInitializationError` / engine not found on Vercel** — add the Lambda binary
  target to `prisma/schema.prisma` and redeploy:
  ```prisma
  generator client {
    provider      = "prisma-client-js"
    binaryTargets = ["native", "rhel-openssl-3.0.x"]
  }
  ```
- **Cookies / HTTPS** — session cookies are automatically marked `Secure` in production; no change needed.
- **Custom domain** — add it in Vercel → Settings → Domains, then set
  `NEXT_PUBLIC_SITE_URL` to the final URL.
- **Local SQLite (`prisma/dev.db`)** from the earlier setup is no longer used and can be deleted.
