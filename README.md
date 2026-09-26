# Tavaru

Premium saree atelier — Next.js, PostgreSQL, WhatsApp orders, admin desk.

**For the days that become photographs.** Orders are confirmed and paid **on WhatsApp**. Nothing is charged on the website.

Forest green `#284232` · ivory. Logo: `public/brand/tavaru-logo.png`. Live: **https://tavaruseere.com**.

## Phone app in ~5 minutes

Do **not** expect Play Store in 5 minutes. Use **Expo Go**:

```bash
cd apps/mobile
npm install
# URL that already opens the shop in your phone browser:
echo 'EXPO_PUBLIC_SITE_URL=https://tavaruseere.com' > .env
npx expo start
```

Install **Expo Go** on Android/iPhone, scan the QR. Details: [apps/mobile/README.md](apps/mobile/README.md).


## Quick start

```bash
cp .env.example .env
# AUTH_SECRET must be a long random string
docker compose up -d
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (GitLab)

**GitLab alone cannot host this shop.** GitLab stores git and can run CI (`.gitlab-ci.yml`). The app is Next.js with a database, APIs, and checkout — not a static site — so **GitLab Pages will not work**.

### Run on your laptop

```bash
git clone <your-gitlab-repo-url>
cd <repo>
cp .env.example .env
docker compose up -d
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Then visit `http://localhost:3000`. Admin: `admin@huduku.in` / `huduku-admin`.

### Put it on the internet (recommended)

1. Create a **Postgres** database (Neon, Supabase, or Render Postgres). Copy the connection string.
2. Postgres is already the Prisma provider. Use Docker (`docker compose up -d`) or a hosted Postgres URL in `DATABASE_URL`.
3. Create an app on **[Render](https://render.com)**, **[Railway](https://railway.app)**, **[Fly.io](https://fly.io)**, or **Vercel**, and **connect the GitLab repo** (they pull from GitLab; you do not need GitHub).
4. Set environment variables from `.env.example`, using your public URL:

```
DATABASE_URL=postgresql://...
AUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_SECRET=<same as AUTH_SECRET>
AUTH_URL=https://tavaruseere.com
NEXTAUTH_URL=https://tavaruseere.com
NEXT_PUBLIC_SITE_URL=https://tavaruseere.com
```

5. Build command: `npx prisma generate && npx prisma db push && npm run db:seed && npm run build`  
   Start command: `npm start`  
   (Seed only the first time, or you will wipe orders.)

Orders open WhatsApp with the bag already typed. Pay by UPI in chat.

GitLab CI (`.gitlab-ci.yml`) will **test and build** on every push. Use a host above to **run** the site. A `Dockerfile` is included if you prefer a container (Fly, Cloud Run, a VPS).

| Role | Email | Password |
|------|--------|----------|
| Customer | customer@huduku.in | huduku123 |
| Admin | admin@huduku.in | huduku-admin |

Coupons: `HUDUKU10`, `FIRSTDRAPE`, `FREESHIP`.

## Payments

There is **no Razorpay / card checkout**. Place order → WhatsApp chat with order number, items, address, and total. You confirm and collect UPI on WhatsApp. Mark **PAID** in Admin → Orders.

## Stack

- Next.js 15 App Router, TypeScript, Tailwind
- Auth.js credentials
- Prisma + **PostgreSQL** (`docker compose up -d` or any Postgres URL)
- Admin at `/admin`
- PWA: `public/manifest.webmanifest`

## Fedora (shop + Postgres + tunnel)

```bash
cd ~/huduku
git fetch origin
git checkout cursor/whatsapp-postgres-939e
# Postgres (Docker):
docker compose up -d
# Put DATABASE_URL=postgresql://tavaru:tavaru@localhost:5432/tavaru in .env
# First time only (wipes data):
npx prisma db push
npm run db:seed
openssl rand -base64 32   # paste into AUTH_SECRET and NEXTAUTH_SECRET
npm run build
# keep these two running:
nohup npm start > nohup.out 2>&1 &
nohup cloudflared tunnel run tavaru > ~/cloudflared.log 2>&1 &
```

If you already have SQLite `dev.db` with catalog you care about, export products from admin after seed, or keep a copy of the old file — `db:seed` on Postgres is a fresh shop.

Change the admin password immediately: `/admin` → Brand & pages.

## Tests

```bash
npm test
```

Price/tax/coupon unit tests live in `src/lib/*.test.ts`.

## Brand

Tavaru, Lavelle Road, Bengaluru. Forest green `#284232` and ivory `#f6f1e4`.

After pulling on the Fedora box: `git pull`, `npm run build`, restart `npm start`. Do **not** run `npm run db:seed` — that wipes orders. Demo logins stay `admin@huduku.in` / `huduku-admin`.

## Your domain

**https://tavaruseere.com** (`www.tavaruseere.com` is a CNAME to the apex).

Set **the same URL** in three places:

1. Fedora `~/huduku/.env`:

```
AUTH_URL=https://tavaruseere.com
NEXTAUTH_URL=https://tavaruseere.com
NEXT_PUBLIC_SITE_URL=https://tavaruseere.com
NEXT_PUBLIC_SUPPORT_EMAIL=hello@tavaruseere.com
```

2. Admin → **Brand & pages** → Public website → `https://tavaruseere.com`

Then `npm run build` and restart `npm start` plus the Cloudflare tunnel. Login/cookies will not work on the domain until AUTH_URL matches.

## Admin (photos and copy)

Sign in as admin, then open `/admin` (or Account → Admin).

- **Brand & pages** — domain, WhatsApp number, logo, About, legal, checkout intro, **admin password**
- **Catalog** — drapes, photos, price, stock
- **Collections / Home banners / Journal / Finishing** — copy and images
- **Coupons / Orders** — codes, tracking, mark PAID, open WhatsApp for that order

Uploads land in `public/uploads` (and logos in `public/brand`) on the machine that runs `npm start`.

