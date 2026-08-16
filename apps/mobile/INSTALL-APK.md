# Install test APK on your phone

A debug APK was built (`assembleDebug`). It is large (~115 MB) so it is **not** stored in Git. Build it on your Mac or Fedora, then copy to the phone.

## On a Mac (easiest)

```bash
git pull
cd apps/mobile
npm install
npx expo prebuild --platform android
cd android
# if you have Android Studio / SDK:
./gradlew assembleDebug
```

APK path:

`apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk`

Copy to the phone (USB, Google Drive, WhatsApp to yourself).

## Install on Android

1. Copy `app-debug.apk` to the phone.
2. Open it in Files.
3. If asked: **Allow from this source** / install unknown apps.
4. Open **Huduku**.
5. First screen: paste the shop URL  
   - Same Wi‑Fi: `http://192.168.29.238:3000`  
   - Off Wi‑Fi: your `https://….trycloudflare.com` (shop + tunnel must be running)

This APK is for **testing only** (debug signature). It will not go on Play Store as-is. Most 64-bit phones (2018+) work.

## Fedora (if you install Android SDK there)

Same `npm install` → `npx expo prebuild --platform android` → `./gradlew assembleDebug` inside `apps/mobile/android`.
