self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("huduku-shell-v1").then((cache) => cache.addAll(["/", "/shop", "/offline.html"])),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  event.respondWith(
    fetch(req).catch(async () => {
      const cached = await caches.match(req);
      return cached || caches.match("/offline.html");
    }),
  );
});
