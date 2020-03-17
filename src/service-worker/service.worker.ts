// docs https://developers.google.com/web/fundamentals/primers/service-workers

import * as assetsSW from "./assets"
import { VERSION } from "./constants"

declare const self: ServiceWorkerGlobalScope

const CACHE = {
  PREFETCHED: `${VERSION}_PREFETCHED`,
  BUILT: `${VERSION}_BUILT`,
}

function precache() {
  const cacheList = ["/", "/index.html", "/public/manifest.json"]

  return caches
    .open(CACHE.PREFETCHED)
    .then(cache => cache.addAll(cacheList))
    .then(() => self.skipWaiting())
    .catch(res => console.dir(res))
}

self.addEventListener("fetch", evt => {
  assetsSW.fetchHandler(evt)
})

self.addEventListener("install", evt => {
  console.log("Service Worker Installed")
  evt.waitUntil(precache())
  // Replace the existing service worker
  return self.skipWaiting()
})

self.addEventListener("activate", evt => {
  console.log("Service Worker Activated")
  // Become the service worker for clients which do not already have a service worker
  return self.clients.claim()
})
