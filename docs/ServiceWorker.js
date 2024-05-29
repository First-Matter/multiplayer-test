const cacheName = "cruxial-x-redesigned-octo-memory-0.0.71";
const contentToCache = [
    "Build/docs.loader.js",
    "Build/docs.framework.js",
    "Build/docs.data",
    "Build/docs.wasm",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
   self.skipWaiting();
    
    e.waitUntil((async function () {
     for (let name of (await caches.keys()))
       caches.delete(name);

      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
   if (e.request.url.endsWith('/ServiceWorker.js')) { return }
   if (e.request.method === 'POST') { return } // Don't cache POST requests

    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
