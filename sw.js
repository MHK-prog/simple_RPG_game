const CACHE_NAME = 'afsaneye-siahchal-v5';
const APP_SHELL = [
  './', './index.html', './manifest.webmanifest',
  './data.js', './js/expansion.js', './js/hero.js', './js/core.js',
  './js/dungeons.js', './js/shop.js', './js/battle.js',
  './fonts/Vazir-Regular.woff2', './fonts/Vazir-Bold.woff2',
  './icons/app-192.png', './icons/app-512.png',
  './icons/svg/agi.svg', './icons/svg/armor.svg', './icons/svg/atk.svg',
  './icons/svg/boots.svg', './icons/svg/def.svg', './icons/svg/fire.svg',
  './icons/svg/gold.svg', './icons/svg/heal.svg', './icons/svg/heart.svg',
  './icons/svg/hero.svg', './icons/svg/lock.svg', './icons/svg/mana.svg',
  './icons/svg/manaRegen.svg', './icons/svg/monster.svg', './icons/svg/save.svg',
  './icons/svg/search.svg', './icons/svg/sword.svg', './icons/svg/trophy.svg',
  './icons/svg/xp.svg'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => {
    if (cached) return cached;
    return fetch(event.request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
      return response;
    }).catch(() => event.request.mode === 'navigate' ? caches.match('./index.html') : Response.error());
  }));
});
