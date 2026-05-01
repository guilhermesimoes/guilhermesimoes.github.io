var CACHE_NAME = 'v0';

function cacheInitialResources() {
  return caches.open(CACHE_NAME).then(cache =>
    cache.addAll(['/', '/blog/', '/offline'])
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
    fetchEvent.respondWith(
      fetch(eventRequest).then(
        (response) => updateCacheAndReturnResponse(eventRequest, response),
        (error) => caches.match(eventRequest).then(cachedPage =>
          cachedPage || caches.match('/offline').then(chromiumWorkaround)
        )
      )
    );
  } else if (eventRequest.url.endsWith('.css')) {
    // "hack" until GitHub pages supports a longer Cache-Control https://github.com/orgs/community/discussions/11884
    fetchEvent.respondWith(
      fetch(eventRequest).then(
        (response) => updateCacheAndReturnResponse(eventRequest, response, true),
        (error) => caches.match(eventRequest)
      )
    );
  }
}

function updateCacheAndReturnResponse(eventRequest, response, force = false) {
  if (force || caches.match(eventRequest)) {
    var clone = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(eventRequest, clone));
  }
  return response;
}

// Workaround for https://issues.chromium.org/issues/41288530
function chromiumWorkaround(cachedOfflinePage) {
  return cachedOfflinePage && new Response(cachedOfflinePage.body)
}

addEventListener('install', (installEvent) => {
  skipWaiting();
  installEvent.waitUntil(cacheInitialResources());
});
addEventListener('activate', (activateEvent) => {
  activateEvent.waitUntil(clearOldCaches());
});
addEventListener('fetch', fetchOrGoToOfflinePage);
