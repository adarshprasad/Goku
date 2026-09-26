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
echo "Shop starting. Watch with: tail -f nohup.out"
echo "Then hard-refresh the browser (Ctrl+Shift+R)."
