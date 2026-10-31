'use strict';
const CACHE = 'bubble-bounce-v13';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png', './icon-maskable.png', './themes.json'];

// Pre-cache the core files AND every background/piece listed in themes.json, so all worlds work offline.
async function precache() {
  const cache = await caches.open(CACHE);
  await Promise.all(CORE.map(u => cache.add(new Request(u, { cache: 'reload' })).catch(() => {})));
  try {
    const themes = await (await cache.match('./themes.json')).json();
    const files = [...new Set(themes.flatMap(t => [t.background, t.piece, ...(t.pieces || []).map(p => typeof p === 'string' ? p : p && p.image)]).filter(Boolean))];
    await Promise.all(files.map(f => cache.add(new Request('./' + f, { cache: 'reload' })).catch(() => {})));
  } catch (e) {}
}
self.addEventListener('install', event => { event.waitUntil(precache().then(() => self.skipWaiting())); });
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(names => Promise.all(names.filter(n => n.startsWith('bubble-bounce-') && n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});

function networkFirst(event, key) {
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) { const copy = response.clone(); event.waitUntil(caches.open(CACHE).then(c => c.put(key || event.request, copy))); }
    return response;
  }).catch(() => caches.match(key || event.request)));
}

self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') return networkFirst(event, './index.html');
  if (url.pathname.endsWith('/themes.json')) return networkFirst(event);          // always pick up your latest theme list
  // everything else (images, sounds): serve from cache instantly, refresh in the background
  event.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(request);
    const net = fetch(request).then(r => { if (r.ok) cache.put(request, r.clone()); return r; }).catch(() => cached);
    if (cached) { event.waitUntil(net); return cached; }
    return net;
  }));
});
