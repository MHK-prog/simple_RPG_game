const CACHE_NAME = 'afsaneye-siahchal-v7';
const APP_SHELL = [
  './', './index.html', './manifest.webmanifest',
  './data.js', './js/expansion.js', './js/hero.js', './js/core.js', './js/pwa.js',
  './js/dungeons.js', './js/shop.js', './js/battle.js',
  './00Static_data/fonts/Vazir-Regular.woff2', './00Static_data/fonts/Vazir-Bold.woff2',
  './00Static_data/assets/pwa/app-192.png', './00Static_data/assets/pwa/app-512.png',
  './00Static_data/assets/ui/agi.svg', './00Static_data/assets/ui/armor.svg', './00Static_data/assets/ui/atk.svg',
  './00Static_data/assets/ui/boots.svg', './00Static_data/assets/ui/def.svg', './00Static_data/assets/ui/fire.svg',
  './00Static_data/assets/ui/gold.svg', './00Static_data/assets/ui/heal.svg', './00Static_data/assets/ui/heart.svg',
  './00Static_data/assets/ui/hero.svg', './00Static_data/assets/ui/lock.svg', './00Static_data/assets/ui/mana.svg',
  './00Static_data/assets/ui/manaRegen.svg', './00Static_data/assets/ui/monster.svg',
  './00Static_data/assets/ui/search.svg', './00Static_data/assets/ui/sword.svg', './00Static_data/assets/ui/trophy.svg',
  './00Static_data/assets/ui/xp.svg',
  './00Static_data/assets/shop/armors/0.webp', './00Static_data/assets/shop/armors/1.webp', './00Static_data/assets/shop/armors/2.webp',
  './00Static_data/assets/shop/armors/3.webp', './00Static_data/assets/shop/armors/4.webp', './00Static_data/assets/shop/armors/5.webp',
  './00Static_data/assets/shop/armors/6.webp', './00Static_data/assets/shop/armors/7.webp', './00Static_data/assets/shop/armors/8.webp', './00Static_data/assets/shop/armors/9.webp',
  './00Static_data/assets/shop/boots/0.webp', './00Static_data/assets/shop/boots/1.webp', './00Static_data/assets/shop/boots/2.webp',
  './00Static_data/assets/shop/boots/3.webp', './00Static_data/assets/shop/boots/4.webp', './00Static_data/assets/shop/boots/5.webp',
  './00Static_data/assets/shop/boots/6.webp', './00Static_data/assets/shop/boots/7.webp', './00Static_data/assets/shop/boots/8.webp', './00Static_data/assets/shop/boots/9.webp',
  './00Static_data/assets/shop/fire-orbs/0.webp', './00Static_data/assets/shop/fire-orbs/1.webp', './00Static_data/assets/shop/fire-orbs/2.webp',
  './00Static_data/assets/shop/fire-orbs/3.webp', './00Static_data/assets/shop/fire-orbs/4.webp', './00Static_data/assets/shop/fire-orbs/5.webp',
  './00Static_data/assets/shop/heals/0.webp', './00Static_data/assets/shop/heals/1.webp', './00Static_data/assets/shop/heals/2.webp',
  './00Static_data/assets/shop/heals/3.webp', './00Static_data/assets/shop/heals/4.webp', './00Static_data/assets/shop/heals/5.webp',
  './00Static_data/assets/shop/mana-regen/0.webp', './00Static_data/assets/shop/mana-regen/1.webp', './00Static_data/assets/shop/mana-regen/2.webp',
  './00Static_data/assets/shop/mana-regen/3.webp', './00Static_data/assets/shop/mana-regen/4.webp', './00Static_data/assets/shop/mana-regen/5.webp',
  './00Static_data/assets/shop/mana-rings/0.webp', './00Static_data/assets/shop/mana-rings/1.webp', './00Static_data/assets/shop/mana-rings/2.webp',
  './00Static_data/assets/shop/mana-rings/3.webp', './00Static_data/assets/shop/mana-rings/4.webp', './00Static_data/assets/shop/mana-rings/5.webp',
  './00Static_data/assets/shop/shields/0.webp', './00Static_data/assets/shop/shields/1.webp', './00Static_data/assets/shop/shields/2.webp',
  './00Static_data/assets/shop/shields/3.webp', './00Static_data/assets/shop/shields/4.webp', './00Static_data/assets/shop/shields/5.webp',
  './00Static_data/assets/shop/shields/6.webp', './00Static_data/assets/shop/shields/7.webp', './00Static_data/assets/shop/shields/8.webp', './00Static_data/assets/shop/shields/9.webp',
  './00Static_data/assets/shop/swords/0.webp', './00Static_data/assets/shop/swords/1.webp', './00Static_data/assets/shop/swords/2.webp',
  './00Static_data/assets/shop/swords/3.webp', './00Static_data/assets/shop/swords/4.webp', './00Static_data/assets/shop/swords/5.webp',
  './00Static_data/assets/shop/swords/6.webp', './00Static_data/assets/shop/swords/7.webp', './00Static_data/assets/shop/swords/8.webp', './00Static_data/assets/shop/swords/9.webp'
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
