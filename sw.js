const CACHE = "numeroloji-tr-v1";
const CORE = [
  "./",
  "./index.html",
  "./css/numerology.css",
  "./js/numerology.js",
  "./js/demo.js",
  "./i18n/meaning_tr.js",
  "./favicon.gif",
  "./icon-192.png",
  "./icon-512.png",
  "./manifest.json"
];


self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // POST vb. istekleri elleme
  if (req.method !== "GET") return;

  // ✅ SAYFA AÇILIŞI (navigate) OFFLINE'DA CACHE'TEN DÖNSÜN
  if (req.mode === "navigate") {
    event.respondWith(
      caches.match(req).then((cached) => {
        return (
          cached ||
          fetch(req).catch(() => caches.match("./index-turkish.html"))
        );
      })
    );
    return;
  }

  // Diğer dosyalar: cache-first
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
