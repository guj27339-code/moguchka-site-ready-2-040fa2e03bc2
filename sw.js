const CACHE = "moguchka-pwa-v3";
const SHELL = ["./", "./index.html", "./portfolio.html", "./manifest.webmanifest", "./assets/icon-192.png", "./assets/icon-512.png", "./assets/photos/05.jpg"];
self.addEventListener("install", event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || url.pathname.includes("/api/") || url.pathname.includes("/admin") || url.pathname.includes("chatgpt") || url.pathname === "/callback") return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok && response.headers.get("content-type")?.includes("text/html")) { const copy=response.clone(); caches.open(CACHE).then(cache=>cache.put(event.request,copy)); }
      return response;
    }).catch(async()=>await caches.match(event.request)||await caches.match("./index.html")));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    if(response.ok && url.pathname.includes("/assets/")){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;
  })));
});
