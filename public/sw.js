// White Murmure — Service Worker (V1).
// Stratégie : cache-first. Le shell + les sons gratuits sont pré-cachés à
// l'installation (tolérant : les fichiers manquants sont ignorés, pour le
// prototype sans les sons réels). Tout le reste est mis en cache au fil de l'eau.

// NOTE : cette liste duplique `src/sounds.js` (champ `file`).
// tools/check_sync.mjs vérifie que les deux restent synchronisées.
const SOUND_FILES = [
  'sounds/TEMP-pluie-douce.wav',
  'sounds/TEMP-tonnerre-lointain.wav',
  'sounds/TEMP-vagues.wav',
  'sounds/TEMP-vent.wav',
  'sounds/TEMP-feu-foyer.wav',
  'sounds/TEMP-cafe-anime.wav',
  'sounds/TEMP-oiseaux.wav',
  'sounds/TEMP-grillons.wav',
  'sounds/TEMP-bruit-blanc.wav',
  'sounds/TEMP-ventilateur.wav',
  'sounds/TEMP-pluie-battante.wav',
  'sounds/TEMP-tonnerre-proche.wav',
  'sounds/TEMP-pluie-sur-vitre.wav',
  'sounds/TEMP-vent-tempete.wav',
  'sounds/TEMP-grele.wav',
  'sounds/TEMP-ruisseau-en-crue.wav',
  'sounds/TEMP-huard.wav',
  'sounds/TEMP-vent-pins.wav',
  'sounds/TEMP-ruisseau-forestier.wav',
  'sounds/TEMP-branches.wav',
  'sounds/TEMP-pluie-en-foret.wav',
  'sounds/TEMP-mesanges.wav',
];

const CACHE = 'white-murmure-v1';
const CORE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Tolérant : ignore les 404 (ex. sons pas encore intégrés).
    await Promise.allSettled(
      [...CORE, ...SOUND_FILES].map((u) => cache.add(u).catch(() => {})),
    );
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(e.request, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(e.request);
      if (res.ok && new URL(e.request.url).origin === self.location.origin) {
        cache.put(e.request, res.clone());
      }
      return res;
    } catch {
      return hit || Response.error();
    }
  })());
});
