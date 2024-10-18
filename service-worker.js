var CACHE_NAME = 'v1';

function cacheResources(urls) {
  return caches.open(CACHE_NAME).then(cache =>
    Promise.all(urls.map((url) => cache.add(url)))
  );
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

function fetchOrGoToOfflinePage(fetchEvent) {
  var eventRequest = fetchEvent.request;

  // going somewhere?
  if (eventRequest.mode === 'navigate') {
    return fetch(eventRequest)
      .catch(() =>
        caches.match(eventRequest.url).then(cachedPage =>
          cachedPage || caches.match('/offline').then(cachedOfflinePage =>
            // workaround for https://issues.chromium.org/issues/41288530
            cachedOfflinePage && new Response(cachedOfflinePage.body)
          )
        )
      );
  }

  return fetch(eventRequest);
}

function onInstall(installEvent) {
  skipWaiting();
  installEvent.waitUntil(
    cacheResources([
      '/',
      '/blog/',
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
