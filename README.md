# SubbaSubbi

Pre-washed newborn clothing sets for hospitals and new mothers. Next.js storefront, hospital portal, admin desk, Razorpay (or a labeled mock gateway), and an installable PWA.

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
| Mother | customer@subbasubbi.in | subba123 |
| Hospital | hospital@subbasubbi.in | subba-hospital |
| Admin | admin@subbasubbi.in | subba-admin |

Coupons: `SOFT10`, `FIRSTSET`, `FREESHIP`.

Hospital bulk rates show only after an account is approved. The demo hospital user is already approved. Apply at `/hospital`. Approve applications at `/admin/hospitals`.

## Payments

Leave `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` empty to use the **mock gateway**. It still creates the order, verifies on the server, decrements stock, and writes a GST invoice number.

When keys are present, checkout opens Razorpay (UPI, cards, netbanking, wallets). Confirm payment only via `/api/webhooks/razorpay`.

COD: India, eligible PIN codes, fee and cap from `src/lib/commerce.ts`. Blocked demo PIN codes: 110001, 400001, 999999.

## Stack

- Next.js 15 App Router, TypeScript, Tailwind
- Auth.js credentials
- Prisma + SQLite locally. For production set a Postgres URL and change `provider` in `prisma/schema.prisma`
- Admin at `/admin`
- Catalog JSON for a later app: `GET /api/catalog` (bulk rates only for an approved hospital session)
- PWA: `public/manifest.webmanifest` and `public/sw.js`
- Expo notes: `apps/mobile/README.md`

Photos in the seed are placeholders. Replace them with your own product photography.

## Tests

```bash
npm test
```
