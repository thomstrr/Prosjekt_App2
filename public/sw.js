const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/script.js",
    "/icon_small.png",
    "/icon_large.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => response || fetch(event.request))
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cache) => cache !== CACHE_NAME).map((cache) => caches.delete(cache))
            );
        })
    );
});