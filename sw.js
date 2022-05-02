// const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches.open('v1').then( (cache) => {
            return cache.addAll(
                []
            ).then( () => {self.skipWaiting() });
        })
    );
});
    
self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (evt) => {
    evt.respondWith(
        caches.match(evt.request).then( (response) => {
            if (response) {
                return response;
            }
            return fetch(evt.request).then(  (response) => {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                return response;
            }).catch(e => console.log(e));
        }).catch( e => console.log(e))
    );
});