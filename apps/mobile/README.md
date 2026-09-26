# SubbaSubbi mobile

The storefront is an installable PWA. A native app should call the same backend.

## Contract

- `GET /api/catalog` returns published sets. `priceBreaks` is empty unless the caller has an approved hospital session. Hospital-only prices are omitted for everyone else.
- Auth: email and password through Auth.js.
- Checkout v1: open a web view to `/checkout`.
- Payments: Razorpay in that web view. A native SDK can come later.

## Visual tokens

Sage `#3f6f64`, ivory `#f6f1ea`, sand `#efe4d6`, ink `#24302c`.
