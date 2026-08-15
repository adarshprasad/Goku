# Huduku mobile (Expo)

The storefront API is the same as the web app.

## Contract

- `GET /shop` catalog HTML; JSON later at `/api/catalog` (add when native list ships)
- Auth: NextAuth JWT cookie on web; native should use email/password against `/api/auth/*` or a dedicated `/api/mobile/login`
- Checkout v1: open `WebView` to `{SITE_URL}/checkout` with the cart cookie / magic link
- Payments: Razorpay native SDK is a follow-on; WebView checkout is acceptable for app v1

## Start later

```bash
npx create-expo-app@latest . --template blank-typescript
# screens: Home, Catalog, PDP, Cart, Account
# reuse SITE_URL from .env
```

Keep visual tokens: maroon `#6b1d2a`, ivory `#f7f1e8`, gold `#c4a574`, serif headlines.
