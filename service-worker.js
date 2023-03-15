var CACHE_NAME = 'v1';

async function cacheResources(resources) {
  var cache = await caches.open(CACHE_NAME);
  var promises = resources.map((resource) =>
    fetch(resource).then(response => cache.put(resource, new Response(response.body)))
  );
  return Promise.all(promises);
}

function clearOldCaches() {
  return caches.keys()
    .then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    )
    .then(() => clients.claim())
}

async function fetchOrGoToOfflinePage(fetchEvent) {
  var eventRequest = fetchEvent.request;

  // going somewhere?
  if (eventRequest.mode === 'navigate') {
    return fetch(eventRequest)
      .catch(() => caches.match('/offline', { cacheName: CACHE_NAME }));
  }
  return fetch(eventRequest);
}

function onInstall(installEvent) {
  skipWaiting();
  installEvent.waitUntil(
    cacheResources([
      '/',
      '/offline',
    ])
  );
}

function onActivate(activateEvent) {
  activateEvent.waitUntil(clearOldCaches);
}

function onFetch(fetchEvent) {
  fetchEvent.respondWith(fetchOrGoToOfflinePage(fetchEvent));
}

addEventListener('install', onInstall);
addEventListener('activate', onActivate);
addEventListener('fetch', onFetch);
