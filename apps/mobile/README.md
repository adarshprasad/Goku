# Tavaru phone app (5 minutes)

This is a **thin Expo app**: it opens your live Tavaru website inside a real app shell (Android + iPhone).  
It is **not** a second catalog. Same products, cart, Razorpay, admin.

Play Store / App Store submission is **not** 5 minutes. **Expo Go** on your phone is.

## 5-minute run

**On the Fedora shop:** keep `npm start` (or systemd) running, and keep a public URL if you are not on the same Wi‑Fi (`cloudflared` or Tailscale).

**On your Mac:**

1. Install **Expo Go** on the phone  
   - Android: Play Store → “Expo Go”  
   - iPhone: App Store → “Expo Go”

2. Point the app at your shop (use the URL that **already loads in the phone browser**):

```bash
cd apps/mobile
npm install
echo 'EXPO_PUBLIC_SITE_URL=https://YOUR-TRYCLOUDFLARE-OR-TAILSCALE-URL' > .env
npx expo start
```

3. Scan the QR code with Expo Go (Android: Expo Go scans it; iPhone: Camera).

If the phone is on **home Wi‑Fi**, this can work:

```bash
EXPO_PUBLIC_SITE_URL=http://192.168.29.238:3000 npx expo start
```

The phone and Fedora must be on the **same Wi‑Fi**. Off Wi‑Fi, use the `https://….trycloudflare.com` URL.

## Play Store later (not 5 minutes)

Needs a Google Play developer account (~$25), `eas build -p android`, store listing, review. Same project; different step.

## Why this is “simple”

| | |
|--|--|
| New screens / APIs | No |
| Payments | Same as website |
| Change products | Still `/admin` on the website |
| Deploy preview | `npx expo start` + Expo Go |
