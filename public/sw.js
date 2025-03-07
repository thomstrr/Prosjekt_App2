const cacheID = "workout-tracker-v2";
const contentToCache = [
  "/",
  "/index.html",
  "/app.mjs",
  "/icon_small.png",
  "/icon_large.png",
  "/css/style.css",
];

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Install");
  event.waitUntil(
    (async () => {
      const cache = await caches.open(cacheID);
      console.log("[Service Worker] Caching all: app shell and content");
      await cache.addAll(contentToCache);
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

