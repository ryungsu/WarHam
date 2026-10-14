import {readdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const assets=readdirSync('dist/assets').map(f=>'assets/'+f);
const portraits=readdirSync('dist/images/operatives').map(f=>'images/operatives/'+f);
const files=['./','index.html','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','data/teams.json','data/version.json','data/missions.json',...assets,...portraits];
const version=createHash('sha256').update(JSON.stringify(files)).digest('hex').slice(0,12);
writeFileSync('dist/sw.js',`const CACHE='killteam-${version}';const FILES=${JSON.stringify(files)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('killteam-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
event.respondWith(caches.open(CACHE).then(async cache=>{if(event.request.mode==='navigate'){try{return await fetch(event.request)}catch{return await cache.match(new URL('./index.html',self.registration.scope))}}
return await cache.match(event.request)||fetch(event.request)}))});`);
