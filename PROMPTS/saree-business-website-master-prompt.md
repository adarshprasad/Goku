# Master prompt: full-fledged saree business website + commerce + mobile

Copy everything inside the **PROMPT** block below into Cursor (or another coding agent) as the first message. Fill the `REPLACE` placeholders first. Use the phased follow-ups at the bottom if you want the agent to build in slices instead of all at once.

---

## PROMPT

```text
You are a principal full-stack engineer, product designer, and e-commerce architect. Build a production-ready digital business for a premium saree brand — not a template shop. Ship a complete, deployable system: storefront, checkout with real payments, operations admin, and a mobile-class experience (responsive web + PWA now, native app later from the same API).

============================================================
1. BRAND & BUSINESS (customize these)
============================================================
Brand name: [REPLACE: e.g. "Kanchi Atelier" / "Silk & Loom"]
Tagline: [REPLACE]
Positioning: premium Indian sarees (handloom, Banarasi, Kanjivaram, Chanderi, organza, linen, designer drape) plus blouses, lehengas, and accessories.
Markets: India first, then NRI / international shipping.
Currency: INR default; show USD/GBP/AED as display currencies later.
Languages: English + Hindi (i18n-ready).
Tone: elegant, warm, editorial — think modern boutique, not loud discount bazaar.
Brand colors: deep maroon / ivory / gold accents, generous whitespace, serif headlines + clean sans body.
Photography style: lifestyle + fabric close-ups; never clip-art.

Legal / ops (placeholders, wire as config):
- GSTIN, business address, support email/phone, WhatsApp Business number
- Return window: 7 days for unused, unstitched pieces; no return on stitched blouses / custom pallu
- Shipping: India 3–7 days; international 10–21 days
- COD: India only, with fee and pincode eligibility

============================================================
2. NORTH STAR PRODUCT
============================================================
A modern, mobile-first saree boutique that feels like a luxury magazine and works like Shopify + a tailor studio.

Must feel:
- Fast (LCP < 2.5s on 4G, CLS < 0.1)
- Tactile (fabric zoom, drape video, color accuracy)
- Trustworthy (secure checkout, GST invoice, tracking, WhatsApp help)
- Operationally complete (inventory, orders, returns, coupons, GST, shipping)

============================================================
3. TECH STACK (do not swap unless blocked)
============================================================
Web app: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui
Auth: NextAuth / Auth.js (email OTP + Google; phone OTP via MSG91 or Twilio later)
DB: PostgreSQL + Prisma
Media: Cloudinary or S3 + ImageKit (responsive images, video)
Payments:
  - India: Razorpay (UPI, cards, netbanking, wallets, EMI) + optional Cashfree
  - International: Stripe (cards) when shipping abroad is enabled
  - COD: custom, with fraud rules
Search: Postgres full-text first; Meilisearch if catalog > ~2k SKUs
Email/SMS: Resend or SES + WhatsApp Cloud API for order updates
Admin: same Next.js app under /admin (RBAC)
Mobile:
  - Phase 1: excellent responsive + PWA (install, offline catalog cache, push later)
  - Phase 2: Expo React Native app consuming the same REST/tRPC API
API: tRPC or well-typed REST under /api, OpenAPI generated
Hosting: Vercel (web) + managed Postgres (Neon/Supabase) + S3
Observability: Sentry + basic analytics (Plausible or GA4)
Feature flags: env-based for COD, international, waitlist

============================================================
4. INFORMATION ARCHITECTURE
============================================================
Public:
- Home (editorial hero, collections, bestsellers, craft stories, lookbook, trust bar)
- Shop / catalog with filters
- Collection landing (e.g. Wedding, Festive, Everyday, Bridal, Handloom, New-in)
- Product detail (PDP)
- Lookbook / journal (styling, weave stories, size/drape guides)
- About / craft / artisans
- Store locator / appointment (optional boutique visit)
- Cart, checkout, order confirmation
- Account: orders, addresses, wishlist, measurements, returns
- Support: FAQ, shipping, returns, contact, WhatsApp
- Legal: privacy, terms, refund, shipping policy, GST invoices

Admin (/admin):
- Dashboard (sales, low stock, pending COD, returns)
- Catalog (products, variants, collections, attributes)
- Inventory & warehouses
- Orders, fulfillment, invoices, e-way bill placeholder
- Customers & segments
- Discounts, gift cards, loyalty
- Content (banners, journal CMS)
- Shipping zones, rates, pincodes
- Payments & settlements view
- Reviews moderation
- Staff roles
- Settings (tax, brand, notifications)

============================================================
5. CATALOG MODEL (saree-specific — this is the differentiator)
============================================================
Product types: Saree, Blouse, Lehenga, Dupatta, Jewelry, Care kit, Gift card.

Saree attributes (filterable + PDP):
- Weave / origin: Banarasi, Kanjivaram, Paithani, Chanderi, Tussar, Cotton, Linen, Organza, Georgette, Crepe, Bandhani, Ikkat, Jamdani, Designer
- Fabric, blend, GSM / weight feel (light / medium / heavy)
- Work: zari, zardozi, embroidery, prints, hand-painted, sequence
- Occasion: wedding, reception, festive, office, casual, party
- Color (primary + secondary), motif, border type, pallu type
- Length (default 5.5m / 6.3m), blouse piece included (yes/no, unstitched length)
- Transparency, lining needed, fall & pico (done / add-on service)
- Care: dry clean only / gentle wash
- Craft story, GI tag if any, artisan note
- Video drape + 360 / zoomable gallery
- Model height + blouse size in photos
- Pair-with (blouse, jewelry, petticoat)

Variants:
- Colorways as variants when same design
- Blouse: size (bust) + fabric + sleeve style; made-to-measure fields
- Inventory per SKU; “made to order” with lead time

Services as add-on SKUs:
- Fall & pico
- Pre-pleating
- Blouse stitching (upload measurement or standard size chart)
- Gift wrap + handwritten note

============================================================
6. STOREFRONT UX (modern, mobile-first)
============================================================
Design system:
- 8px grid, 44px min tap targets, safe-area for iOS
- Sticky header: logo, search, collections mega-menu (desktop), cart, account
- Mobile: bottom nav (Home, Shop, Wishlist, Account) + floating WhatsApp
- Skeleton loaders, optimistic cart, toast confirmations
- Dark-mode optional; default light editorial

Home:
- Full-bleed cinematic hero with CTA “Shop the new weave”
- Horizontal collection rails (swipe on mobile)
- “Shop by occasion” and “Shop by weave” visual tiles
- Featured artisan / process film
- UGC / Instagram grid
- Trust: secure pay, easy returns, pan-India shipping, authentic handloom

PLP:
- Filters: weave, fabric, color, price, occasion, work, blouse piece, in-stock
- Sort: new, popular, price, discount
- Quick view, wishlist heart, color swatches
- Infinite scroll + “showing 24 of 180”
- Empty states with suggestions

PDP:
- Gallery with pinch-zoom, video, fabric close-up
- Price, MRP, discount, EMI hint (Razorpay)
- Stock urgency (honest, not fake)
- Size / blouse options + measurement guide modal
- Add to cart / Buy now / Wishlist / Share
- “Need help draping?” WhatsApp
- Shipping estimator by pincode (India)
- Reviews with photos
- Complete the look
- Accordion: description, craft, care, shipping, stitching

Cart & checkout (guest + logged-in):
- Cart drawer on mobile
- Address book, GSTIN on invoice optional
- Coupon, gift card, store credit
- Shipping method + COD eligibility check
- Order notes (blouse stitching)
- Razorpay Checkout / Stripe Elements
- 3DS, UPI intent, saved cards if available
- Confirmation page + email/WhatsApp
- Abandoned cart email (basic)

Account:
- Order timeline + tracking link
- Reorder, return request with photos
- Wishlist, recently viewed
- Saved measurements profile

Accessibility: WCAG 2.1 AA, keyboard, alt text, captions on videos.
SEO: unique titles, JSON-LD Product/Offer/FAQ, sitemap, OG images, canonicals.
i18n: next-intl structure even if Hindi copy is partial.

============================================================
7. PAYMENTS, TAX, ORDERS
============================================================
Checkout flow:
1. Validate cart stock + prices server-side
2. Create Order (PENDING) + PaymentIntent
3. Client opens Razorpay/Stripe with order_id
4. Webhook verifies signature; mark PAID; decrement inventory; send invoice
5. Never trust client “payment success” alone

Razorpay: UPI, cards, netbanking, wallets, EMI. Test + live keys via env.
Stripe: international cards when `ENABLE_INTERNATIONAL=true`.
COD: extra fee, max order value, block high-risk pincodes, auto-cancel if unpaid confirmation SMS ignored.
Refunds: full/partial via gateway; restock rules; RTO handling for COD.
Invoices: GST-compliant PDF (CGST/SGST or IGST), HSN codes on sarees.
Idempotent webhooks. Store gateway events.

============================================================
8. OPERATIONS
============================================================
Inventory: prevent oversell with transactions; low-stock alerts; preorder flag.
Fulfillment: pick list, packing, AWB via Shiprocket/Delhivery stub (interface + mock, then real).
Returns: portal + admin approve/reject; refund or store credit.
Promotions: percent/fixed, collection/SKU, first-order, free shipping threshold, festive sale windows.
Reviews: verified buyer, photo, rating, moderation.
CRM-lite: tags (bridal, repeat, wholesale inquiry).
Wholesale / boutique inquiry form (not full B2B in v1).
Analytics: conversion funnel, AOV, top weaves, COD vs prepaid.

============================================================
9. MOBILE & APP
============================================================
Now:
- Mobile-first UI, PWA manifest, add-to-home-screen, theme-color
- Fast PLP on mid-range Android
- Share Product API, tel: and wa.me deep links

Next (scaffold, do not fake a store listing):
- `/apps/mobile` Expo app: home, catalog, PDP, cart, checkout WebView or native Razorpay SDK
- Auth token shared with API
- Push notifications stub (Expo notifications)
Document how to continue the native app after web MVP.

============================================================
10. SECURITY & COMPLIANCE
============================================================
- HTTPS only, secure cookies, CSRF on mutations
- Rate limit auth, checkout, OTP
- PCI: never store card data; gateway only
- Secrets in env; no keys in client except publishable
- RBAC for admin; audit log for refunds
- DPDP-aware privacy policy; cookie consent if analytics
- Input validation (Zod) on every API
- Image upload malware/type checks, max size
- SQL injection / XSS hardening

============================================================
11. WHAT TO BUILD IN THIS REPO (MVP that still feels complete)
============================================================
Implement a working vertical slice, not mocks-only:

A. App shell, design system, layout, home, catalog, PDP with seed data (~24 sarees, realistic names/prices/weaves)
B. Cart, wishlist (local + account), auth (email magic link or credentials for demo + Google optional)
C. Checkout + Razorpay test mode (document keys). If keys missing, use a clearly labeled mock gateway that still runs the order state machine
D. Order confirmation, account orders
E. Admin: products CRUD, orders list, status updates, coupon create
F. Policies pages, footer, WhatsApp button, pincode check stub
G. PWA extras
H. Seed script, README with env, architecture, how to run, how to add Razorpay keys, how to start Expo later
I. Tests: critical unit (price/tax/coupon) + one e2e happy path if feasible

Seed catalog must look real: Banarasi silk, Kanjivaram, pastel organza, etc., with INR prices, discount, blouse piece flags.

============================================================
12. QUALITY BAR
============================================================
- TypeScript strict, no `any`
- Accessible components, loading/error/empty states
- No lorem on customer-facing pages
- README: local run, env vars, demo admin login
- .env.example
- Commit in logical chunks
- Do not add unused libraries
- Prefer server components; client only where needed

============================================================
13. IMPLEMENTATION ORDER
============================================================
1. Scaffold monorepo or single Next app, Prisma schema, seed
2. Design tokens + UI kit
3. Home + PLP + PDP
4. Cart + auth
5. Checkout + payments webhooks + invoices
6. Admin
7. PWA + polish + policies
8. Expo scaffold + API contract doc
9. Tests + README

Start now. Create the project in this repository. After the first milestone (runnable home + catalog + PDP + seed), continue through checkout and admin without waiting. Ask only if a secret is required and cannot be stubbed.
```

---

## How to use this prompt well

1. Fill every `[REPLACE]` and drop in real logo, GSTIN, WhatsApp, and photos when you have them.
2. Paste the **PROMPT** block as the first instruction to the coding agent in this repo.
3. Add Razorpay test keys in `.env` as soon as checkout is wired (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, webhook secret).
4. If the agent stalls, send one of the follow-ups below instead of repeating the whole prompt.

### Follow-up prompts (use in order if you want phased delivery)

**Phase 1 — Design & catalog**

```text
Implement only the design system, home, collection pages, PLP, and PDP with Prisma seed of 24 sarees. Mobile-first, editorial luxury UI. No checkout yet. Make it look launch-ready.
```

**Phase 2 — Cart, account, checkout**

```text
Add cart, wishlist, auth, address book, coupon engine, GST invoice fields, and Razorpay test checkout with webhook-verified order state. Include COD with pincode rules. Guest checkout allowed.
```

**Phase 3 — Admin & ops**

```text
Build /admin with RBAC: catalog CRUD, inventory, orders, refunds, discounts, content banners. Dashboard with today’s sales, low stock, pending COD.
```

**Phase 4 — Mobile**

```text
Add PWA installability and an Expo app in apps/mobile that lists products, shows PDP, and reuses login + cart API. Native Razorpay can be a documented next step; WebView checkout is OK for v1.
```

---

## Suggested env vars

```bash
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
CLOUDINARY_URL=
WHATSAPP_NUMBER=91XXXXXXXXXX
NEXT_PUBLIC_BRAND_NAME=
ENABLE_COD=true
ENABLE_INTERNATIONAL=false
```

---

## Scope you can cut if time is tight

Keep: catalog, PDP, cart, prepaid Razorpay, admin orders, mobile-responsive UI.  
Defer: native app, Stripe, Shiprocket live, Hindi translations, loyalty, wholesale.
