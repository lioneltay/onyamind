export function fetchHandler(evt: FetchEvent): void {
  // console.dir(evt)

  // evt.respondWith(
  //   caches
  //     .open(CACHE.PREFETCHED)
  //     .then(cache => cache.match(evt.request))
  //     .then(match => {
  //       if (match) {
  //         // console.log("FROM CACHE", match)
  //         return match
  //       }

  //       return fetch(evt.request).then(response => {
  //         // console.log("CACHING", evt.request, response)

  //         return shouldCache(evt.request)
  //           ? caches
  //               .open(CACHE.BUILT)
  //               .then(cache => cache.put(evt.request, response.clone()))
  //               .then(() => response)
  //           : response
  //       })
  //     })
  // )
}