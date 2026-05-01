var CACHE_NAME = 'v1';

function cacheInitialResources() {
  return caches.open(CACHE_NAME).then(cache =>
    cache.addAll([
      '/',
      '/blog/',
      '/offline',
    ])
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
      .then(
        (response) => updateCacheAndReturnResponse(eventRequest, response),
        (error) => caches.match(eventRequest).then(cachedPage =>
          cachedPage || caches.match('/offline').then(cachedOfflinePage =>
            // workaround for https://issues.chromium.org/issues/41288530
            cachedOfflinePage && new Response(cachedOfflinePage.body)
          )
        )
      );
  }

  // "hack" until GitHub pages supports a longer Cache-Control https://github.com/orgs/community/discussions/11884
  if (eventRequest.url.endsWith('.css')) {
    return fetch(eventRequest).then(
        (response) => updateCacheAndReturnResponse(eventRequest, response, true),
        (error) => caches.match(eventRequest)
      );
  }

  return fetch(eventRequest);
}

function updateCacheAndReturnResponse(eventRequest, response, force = false) {
  if (force || caches.match(eventRequest)) {
    var clone = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(eventRequest, clone));
  }
  return response;
}

function onInstall(installEvent) {
  skipWaiting();
  installEvent.waitUntil(cacheInitialResources());
}

function onActivate(activateEvent) {
  activateEvent.waitUntil(clearOldCaches());
}

function onFetch(fetchEvent) {
  fetchEvent.respondWith(fetchOrGoToOfflinePage(fetchEvent));
}

addEventListener('install', onInstall);
addEventListener('activate', onActivate);
addEventListener('fetch', onFetch);
