# Test APK (standalone — no Metro)

Uninstall the **old Huduku** app first (it was a debug build and needs a computer). Then install this one.

## Download

From GitLab/GitHub branch `cursor/huduku-saree-store-939e`:

**`apps/mobile/releases/huduku.apk.gz`**

Direct (GitHub):  
https://github.com/adarshprasad/Goku/raw/cursor/huduku-saree-store-939e/apps/mobile/releases/huduku.apk.gz

On Mac or Fedora:

```bash
cd ~/huduku   # or git pull in your clone
git pull
cd apps/mobile/releases
gzip -d -k huduku.apk.gz
```

Copy **`huduku.apk`** to the phone → open it → allow unknown apps → install.

## First open

Paste the shop URL:

- Same Wi‑Fi: `http://192.168.29.238:3000`
- Off Wi‑Fi: your `https://….trycloudflare.com`

The Fedora shop must be running (`npm start`).
