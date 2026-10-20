const CACHE_NAME = "kscor-v94-fixed-v2";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./qrcode.min.js" // local, plus de cdn.jsdelivr.net
];


self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});


self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});


self.addEventListener("fetch", (e) => {
  const url = e.request.url;
  // JAMAIS cacher DGI / API
  if (url.includes("e-mecef.impots.bj") || url.includes("/api") || url.includes("workers.dev")) {
    return; // laisse le navigateur gérer
  }
  e.respondWith(
    caches.match(e.request).then((resp) => resp || fetch(e.request).catch(() => caches.match("./index.html")))
  );
});