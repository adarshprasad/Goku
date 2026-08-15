# Huduku

Premium saree atelier storefront — Next.js, Prisma (SQLite locally / Postgres in production), Razorpay (or labeled mock gateway), admin desk, PWA.

**Hennige anda seere inda** — adds beauty to the woman.

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

Huduku, Lavelle Road, Bengaluru. GSTIN and WhatsApp are env-driven — see `.env.example`.
