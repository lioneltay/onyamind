const CACHE = "v1"

console.log(`THIS IS THE SERVICE WORKER FILE ${CACHE}`)

function precache() {
  const cache_list = ["/", "/index.html", "/main.js", "/public/manifest.json"]

  caches
    .open(CACHE)
    .then(res => (console.log("opened"), res))
    .then(cache => {
      const x = cache.addAll(cache_list)

      return x
    })
    .then(res => (console.log("yo"), res))
    .then(() => self.skipWaiting())
    .catch(res => console.dir(res))
}

self.addEventListener("install", evt => {
  console.log("The serivce worker is being installed.")

  evt.waitUntil(precache())
})

function shouldCache(request) {
  const whitelist = [/.js$/, /.css$/]

  const blacklist = [/sockjs-node\/info/]

  function applyTest(test, str) {
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
      .open(CACHE)
      .then(cache =>
        cache.match(evt.request).then(match => {
          if (match) {
            console.log("FROM CACHE")
            return match
          }

          return fetch(evt.request).then(response => {
            console.log("CACHING", evt.request, response)

            return shouldCache(evt.request)
              ? caches
                  .open(CACHE)
                  .then(cache => cache.put(evt.request, response.clone()))
                  .then(() => response)
              : response
          })
        })
      )
      .then(res => {
        console.log("RESPONDING", res)
        return res
      })
  )
})
