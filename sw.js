const CACHE_NAME = "web-media-player-20260114102020";
const ASSETS = // embeded from ./resouce/assets.json
[
    "./",
    "./image/appicon.png",
    "./image/favicon.png",
    "./web.manifest.json"
];
self.addEventListener
(
    "install",
    event =>
    {
        event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
        self.skipWaiting();
    }
);
self.addEventListener
(
    "activate",
    event =>
    {
        event.waitUntil
        (
            caches.keys().then
            (
                keys => Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k): Promise.resolve())))
            )
        );
        self.clients.claim();
    }
);
self.addEventListener
(
    "fetch",
    event =>
    {
        event.respondWith
        (
            Promise.race
            ([
                fetch(event.request),
                new Promise((_, reject) => setTimeout(() => reject(new Error("fetch timeout")), 5000))
            ])
            .then
            (
                response =>
                {
                    if (response && 200 === response.status)
                    {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => cache.put(event.request, responseToCache));
                    }
                    return response;
                }
            )
            .catch(() => caches.match(event.request))
        );
    }
);
