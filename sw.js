/* FitForLife service worker — caches the app so it works fully offline once installed.
   Network-first: a redeployed build shows up on the very next load whenever the phone has
   connectivity. Falls back to cache only when offline (mid-workout, airplane mode, etc.) —
   previously this was cache-first, which always served the stale version once and only
   caught up in the background for the load after that. */
const CACHE = 'ffl-v3';
const ASSETS = ['./', './FitForLife.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(async c => {
      for (const u of ASSETS) { try { await c.add(u); } catch (err) {} }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  /* Only ever handle our own origin. The cloud-sync calls go to api.github.com, and caching
     those was actively harmful in two ways:
       1. the cached response would be served later, so a Pull could return stale sync data;
       2. worse, the offline fallback below returns './FitForLife.html' — so a FAILED API
          request came back as the app's own HTML with res.ok true, and the caller then died
          on r.json() with a JSON parse error, hiding the real network failure.
     Cross-origin requests are now left entirely to the network layer. */
  let sameOrigin = false;
  try { sameOrigin = new URL(e.request.url).origin === self.location.origin; } catch (err) {}
  if (!sameOrigin) return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(hit => hit || caches.match('./FitForLife.html')))
  );
});
