const cacheID = "workout-tracker-" + new Date().getTime();

const contentToCache = [
  "/index.html",
  "/app.mjs",
  "/style.css",
  "/icons/icon_large.png",
  "/icons/icon_small.png",
  "/manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Install, cacheID:", cacheID);
  event.waitUntil(
    caches.open(cacheID).then((cache) => {
      return cache.addAll(contentToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activated, cacheID:", cacheID);
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== cacheID) {
            console.log(`[Service Worker] Deleting old cache: ${key}`);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
