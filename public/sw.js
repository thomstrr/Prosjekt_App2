const cacheID = "workout-tracker-v2";
const contentToCache = [
  "/",
  "/index.html",
  "/app.mjs",
  "/icons/icon_small.png",
  "/icons/icon_large.png",
  "/style.css",
];

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Install");
  event.waitUntil(
    (async () => {
      const cache = await caches.open(cacheID);
      console.log("[Service Worker] Caching all: app shell and content");
      try {
        await cache.addAll(contentToCache);
      } catch (error) {
        console.error("[Service Worker] Failed to cache resources", error);
      }
    })()
  );
});

self.addEventListener("fetch", (event) => {
  if (
    !(
      event.request.url.startsWith("http:") ||
      event.request.url.startsWith("https:")
    )
  ) { 
    return;
}

  event.respondWith(
    (async () => {
      const r = await caches.match(event.request);
      console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
      if (r) { return r; }
      const response = await fetch(event.request);
      const cache = await caches.open(cacheID);
      console.log(`[Service Worker] Caching new resource: ${event.request.url}`);
      cache.put(event.request, response.clone());
      return response;
    })()
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activated');
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
});

