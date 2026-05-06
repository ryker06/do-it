// Do It — service worker with version-check force-reload to fix iOS PWA caching bug
const VERSION = "v1.2026-05-06-1";
const HTML_CACHE = `do-it-html-${VERSION}`;
const ASSET_CACHE = `do-it-assets-${VERSION}`;

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== HTML_CACHE && k !== ASSET_CACHE)
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((c) =>
        c.postMessage({ type: "sw-version", version: VERSION }),
      );
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Always network-first for HTML so user gets latest version
  if (
    req.mode === "navigate" ||
    (req.headers.get("accept") || "").includes("text/html")
  ) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req, { cache: "no-store" });
          const cache = await caches.open(HTML_CACHE);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(HTML_CACHE);
          const cached = await cache.match(req);
          return cached ?? new Response("Offline", { status: 503 });
        }
      })(),
    );
    return;
  }

  // Cache-first for hashed assets (Next.js content-hashes them)
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(ASSET_CACHE);
        const cached = await cache.match(req);
        if (cached) return cached;
        const fresh = await fetch(req);
        cache.put(req, fresh.clone());
        return fresh;
      })(),
    );
  }
});
