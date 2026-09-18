# Huduku mobile (Expo)

The storefront JSON APIs are ready for a React Native / Expo client. Checkout v1 stays a WebView so Razorpay (or the labeled mock gateway) keeps a single server-side state machine.

## Live web APIs

| Method | Path | Notes |
|--------|------|--------|
| GET | `/api/catalog?take=24&cursor=&weave=` | Product list for native grids |
| GET | `/api/search?q=` | Predictive search (min 2 chars) |
| POST | `/api/checkout` | Same payload as web checkout |
| POST | `/api/checkout/quote` | GST / shipping / COD preview |
| POST | `/api/track` | `{ number, email }` guest tracking |
| GET | `/api/pincode?pin=` | Serviceability |

Auth: email/password against Auth.js credentials. Native v1 can also open `{SITE_URL}/login`.

## Start later

```bash
npx create-expo-app@latest . --template blank-typescript
# screens: Home, Catalog, PDP, Cart, Account
# reuse SITE_URL from .env
# PDP + cart locally; Checkout screen = WebView to /checkout
```

Visual tokens: maroon `#6b1d2a`, ivory `#f7f1e8`, gold `#c4a574`, serif headlines.
