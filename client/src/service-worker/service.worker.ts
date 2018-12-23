import * as taskSW from "./task"
import * as assetsSW from './assets'
import {VERSION} from './constants'

declare var self: ServiceWorkerGlobalScope


const CACHE = {
  PREFETCHED: `${VERSION}_PREFETCHED`,
  BUILT: `${VERSION}_BUILT`,
}

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

self.addEventListener("fetch", evt => {
  assetsSW.fetchHandler(evt)
  taskSW.fetchHandler(evt)

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
})
