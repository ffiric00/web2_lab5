const CACHE_NAME = 'news-cache-v1'; 
const API_BASE_URL = 'https://newsapi.org/v2/top-headlines';
const API_KEY = '541e7a68fe534c10be6899e8c17a17ee'; 




self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([ 
        `${API_BASE_URL}?country=us&apiKey=${API_KEY}`,
         '/idex.html', 
         '/RecordAudio.js',
         '/NewsList.js'
      ]);
    })
  );
});
 
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const isApiRequest = event.request.url.startsWith(API_BASE_URL); 

  if (isApiRequest) {
    clients.matchAll().then((clientList) => {
      clientList.forEach((client) => {
        client.postMessage({ status: 'fetching', url: event.request.url });
      });
    });
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (!navigator.onLine) {
        return cachedResponse || new Response(null, { status: 404, statusText: 'Offline' });
      }

      return (
        cachedResponse ||
        fetch(event.request)
          .then((response) => {
            const clonedResponse = response.clone();

            if (isApiRequest) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, clonedResponse);
              });
            }

            return response;
          })
          .catch(() => {
            return cachedResponse || caches.match(event.request);
          })
      );
    })
  );
});
