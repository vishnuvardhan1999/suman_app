const CACHE_NAME = "suman-app-cache-v1";
const PRECACHE = [ "/", "/index.html", "/manifest.json", "/suman_logo-512.png", "/suman_logo-192.png" ];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(() => caches.match("/index.html")));
    return;
  }
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      const clone = res.clone();
      caches.open(CACHE_NAME).then((c) => c.put(req, clone));
      return res;
    }))
  );
});
