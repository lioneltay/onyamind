import { VERSION } from "./constants"

const CACHE = `${VERSION}_ASSET_CACHE`

export function fetchHandler(evt: FetchEvent) {
  if (evt.request.method === "GET") {
    // Network first
    evt.respondWith(
      fetch(evt.request)
        .then(response => {
          return shouldCache(evt.request)
            ? caches
                .open(CACHE)
                .then(cache => cache.put(evt.request, response.clone()))
                .then(() => response)
            : response
        })
        .catch(() =>
          caches
            .open(CACHE)
            .then(cache => cache.match(evt.request))
            .then(match => {
              if (!match) {
                console.dir(evt)
                throw Error("No match")
              }
              return match
            })
        )
    )

    // // Cache first
    // evt.respondWith(
    //   caches
    //     .open(CACHE)
    //     .then(cache => cache.match(evt.request))
    //     .then(match => {
    //       if (match) {
    //         console.log("FROM CACHE", match)
    //         return match
    //       }

    //       return fetch(evt.request).then(response => {

    //         return shouldCache(evt.request)
    //           ? caches
    //               .open(CACHE)
    //               .then(cache => cache.put(evt.request, response.clone()))
    //               .then(() => response)
    //           : response
    //       })
    //     })
    // )
  }
}

function shouldCache(request: Request) {
  const whitelist = [/.js$/, /.css$/, ""]

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
