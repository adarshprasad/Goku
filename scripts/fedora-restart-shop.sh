#!/usr/bin/env bash
# Stop the old Next process, pull, rebuild, start. Run from ~/huduku as adarsh (not root).
set -euo pipefail
cd "$(dirname "$0")/.."

echo "Stopping anything on port 3000..."
if command -v fuser >/dev/null 2>&1; then
  fuser -k 3000/tcp >/dev/null 2>&1 || true
fi
pkill -f "next-server" >/dev/null 2>&1 || true
pkill -f "next start" >/dev/null 2>&1 || true
sleep 1

git pull
npm run build
nohup npm start > nohup.out 2>&1 &
#!/usr/bin/env bash
# Stop the old Next process, pull, rebuild, start shop + Cloudflare tunnel.
# Run from ~/huduku as adarsh (not root).
set -euo pipefail
cd "$(dirname "$0")/.."

echo "Stopping anything on port 3000..."
if command -v fuser >/dev/null 2>&1; then
  fuser -k 3000/tcp >/dev/null 2>&1 || true
fi
pkill -f "next-server" >/dev/null 2>&1 || true
pkill -f "next start" >/dev/null 2>&1 || true
pkill -f "cloudflared tunnel" >/dev/null 2>&1 || true
sleep 1

git pull
npm run build
nohup npm start > nohup.out 2>&1 &
echo "Shop starting. Watch with: tail -f nohup.out"

if command -v cloudflared >/dev/null 2>&1; then
  nohup cloudflared tunnel run tavaru > "$HOME/cloudflared.log" 2>&1 &
  echo "Cloudflare tunnel starting. Watch with: tail -f ~/cloudflared.log"
else
  echo "cloudflared is not installed. Public https://tavaruseere.com will not work until you install it."
fi

echo "On this PC open http://127.0.0.1:3000/login — that does not need Cloudflare."
echo "Then hard-refresh the browser (Ctrl+Shift+R)."

