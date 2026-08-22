const CACHE='mj-hospitality-v18';
const CORE=['./','index.html','app.css','app.js','menu-data.js','menu-extra.js','manifest.webmanifest','assets/icon.svg','assets/4k-v2/hero-mj-signature.jpg','assets/heroes-v2/arabic.webp','assets/heroes-v2/specialty.webp','assets/heroes-v2/tea.webp','assets/heroes-v2/sparkling.webp'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request).then(response=>response||caches.match('./'))))});
