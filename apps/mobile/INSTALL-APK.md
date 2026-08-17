# Install Tavaru on the phone

**This file is Android only.** An iPhone cannot install an `.apk`.

## You must install `huduku.apk`, not `.gz`

If the file is `huduku.apk.gz`, unzip it first on a computer:

```bash
gzip -d -k huduku.apk.gz
```

The installable file name must be **`huduku.apk`** (filename from the last APK build; rebuild Expo to show Tavaru on the home screen).

Download (GitHub, use this exact link so you get the file, not an HTML page):

https://github.com/adarshprasad/Goku/raw/cursor/huduku-saree-store-939e/apps/mobile/releases/huduku.apk

Or after `git pull`: `apps/mobile/releases/huduku.apk`

## On Android

1. Uninstall any old **Huduku** / **Tavaru** app.
2. Copy `huduku.apk` to the phone (USB, Drive, WhatsApp).
3. Chrome/Files → tap the apk.
4. If blocked: Settings → Apps → Special access → **Install unknown apps** → allow Chrome or Files.
5. Xiaomi/Vivo/Oppo: also turn off “Install via USB” blocking / allow that installer.
6. Open the app → paste `http://192.168.29.238:3000` or your https tunnel URL.

If it still says parse error / not installed, the download was the webpage. Use the **raw** link above, or copy the apk from Fedora with USB.
