# Tavaru

Premium saree atelier storefront — Next.js, Prisma (SQLite locally / Postgres in production), Razorpay (or labeled mock gateway), admin desk, PWA.

**For the days that become photographs.**

Forest green `#284232` · champagne gold `#D1C792`. Logo: `public/brand/tavaru-logo.png`.

## Phone app in ~5 minutes

Do **not** expect Play Store in 5 minutes. Use **Expo Go**:

```bash
cd apps/mobile
npm install
# URL that already opens the shop in your phone browser:
echo 'EXPO_PUBLIC_SITE_URL=https://YOUR-PUBLIC-SHOP-URL' > .env
npx expo start
```

Install **Expo Go** on Android/iPhone, scan the QR. Details: [apps/mobile/README.md](apps/mobile/README.md).


## Quick start

```bash
cp .env.example .env
# AUTH_SECRET must be a long random string
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
# put a long random string in AUTH_SECRET and NEXTAUTH_SECRET
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Then visit `http://localhost:3000`. Admin: `admin@huduku.in` / `huduku-admin`.

### Put it on the internet (recommended)

1. Create a **Postgres** database (Neon, Supabase, or Render Postgres). Copy the connection string.
2. In `prisma/schema.prisma` change `provider = "sqlite"` to `provider = "postgresql"`.
3. Create an app on **[Render](https://render.com)**, **[Railway](https://railway.app)**, **[Fly.io](https://fly.io)**, or **Vercel**, and **connect the GitLab repo** (they pull from GitLab; you do not need GitHub).
4. Set environment variables from `.env.example`, using your public URL:

```
DATABASE_URL=postgresql://...
AUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_SECRET=<same as AUTH_SECRET>
AUTH_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

5. Build command: `npx prisma generate && npx prisma db push && npm run db:seed && npm run build`  
   Start command: `npm start`  
   (Seed only the first time, or you will wipe orders.)

6. Optional: add Razorpay keys and set the webhook URL to `https://your-domain.com/api/webhooks/razorpay`.

GitLab CI (`.gitlab-ci.yml`) will **test and build** on every push. Use a host above to **run** the site. A `Dockerfile` is included if you prefer a container (Fly, Cloud Run, a VPS).

| Role | Email | Password |
|------|--------|----------|
| Customer | customer@huduku.in | huduku123 |
| Admin | admin@huduku.in | huduku-admin |

Coupons: `HUDUKU10`, `FIRSTDRAPE`, `FREESHIP`.

## Payments

Leave `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` empty to use the **mock gateway**. It still creates the order, verifies on the server, decrements stock, and writes a GST invoice number.

When keys are present, checkout opens Razorpay (UPI, cards, netbanking, wallets, EMI). Confirm payment only via `/api/webhooks/razorpay` (signature).

COD: India, eligible pincodes, ₹49 fee, max ₹25,000. Blocked demo pincodes: 110001, 400001, 999999.

Stripe is gated behind `ENABLE_INTERNATIONAL=true`.

## Stack

- Next.js 15 App Router, TypeScript, Tailwind
- Auth.js credentials (Google optional)
- Prisma + SQLite (`DATABASE_URL=file:./dev.db`). For production set a Postgres URL and change `provider` in `prisma/schema.prisma`
- Admin at `/admin` (ADMIN / STAFF)
- PWA: `public/manifest.webmanifest`
- Expo notes: `apps/mobile/README.md`

## Tests

```bash
npm test
```

Price/tax/coupon unit tests live in `src/lib/*.test.ts`.

## Brand

Tavaru, Lavelle Road, Bengaluru. GSTIN and WhatsApp are env-driven — see `.env.example`.

After pulling this rebrand on the Fedora box: `git pull`, `npm run build`, restart `npm start`. Do **not** run `npm run db:seed` — that wipes orders. Demo logins stay `admin@huduku.in` / `huduku-admin`.
