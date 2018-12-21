import "./misc"

declare var self: ServiceWorkerGlobalScope

const VERSION = "v1"

const CACHE = {
  PREFETCHED: `${VERSION}_PREFETCHED`,
  BUILT: `${VERSION}_BUILT`,
}

console.log(`THIS IS THE SERVICE WORKER FILE ${CACHE}`)

self.addEventListener("install", evt => {
  console.log("Service Worker Installed")
  evt.waitUntil(precache())
  // Replace the existing service worker
  // return self.skipWaiting()
})

self.addEventListener("activate", evt => {
  console.log("Service Worker Activated")
  // Become the service worker for clients which do not already have a service worker
  // return return self.clients.claim()
})

function precache() {
  const cache_list = ["/", "/index.html", "/public/manifest.json"]

  return caches
    .open(CACHE.PREFETCHED)
    .then(cache => cache.addAll(cache_list))
    .then(() => self.skipWaiting())
    .catch(res => console.dir(res))
}

function shouldCache(request: Request) {
  const whitelist = [/.js$/, /.css$/]

  const blacklist = [/sockjs-node\/info/]

  function applyTest(test: string | RegExp, str: string) {
    return typeof test === "string" ? str.includes(test) : test.test(str)
  }

  const url = request instanceof Request ? request.url : request

  return (
    whitelist.some(reg => applyTest(reg, url)) &&
    !blacklist.some(reg => applyTest(reg, url))
  )
}

self.addEventListener("fetch", evt => {
  console.log("The service worker is service the asset.")

  evt.respondWith(
    caches
      .open(CACHE.PREFETCHED)
      .then(cache => cache.match(evt.request))
      .then(match => {
        if (match) {
          console.log("FROM CACHE", match)
          return match
        }

        return fetch(evt.request).then(response => {
          console.log("CACHING", evt.request, response)

          return shouldCache(evt.request)
            ? caches
                .open(CACHE.BUILT)
                .then(cache => cache.put(evt.request, response.clone()))
                .then(() => response)
            : response
        })
      })
  )
})
