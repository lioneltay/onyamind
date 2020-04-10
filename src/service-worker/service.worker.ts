// https://developers.google.com/web/fundamentals/primers/service-workers
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
import "core-js/stable"
import "regenerator-runtime/runtime"
import { CACHE_KEY, CACHE_KEY_LIST } from "./constants"
import fetchHandler from "./fetch-handler"

declare const self: ServiceWorkerGlobalScope

function precache() {
  const cacheList = ["/", "/index.html", "/public/manifest.json"]

  return caches
    .open(CACHE_KEY)
    .then((cache) => cache.addAll(cacheList))
    .then(() => self.skipWaiting())
    .catch((res) => console.dir(res))
}

self.addEventListener("fetch", (event) => {
  event.respondWith(fetchHandler(event))
})

self.addEventListener("install", (evt) => {
  console.log("Service Worker Installed")
  //
  // Replace the existing service worker
  self.skipWaiting()
  evt.waitUntil(precache())
})

self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated")

  // Clean up old caches
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (CACHE_KEY_LIST.indexOf(key) === -1) {
            return caches.delete(key)
          }
        }),
      )
    }),
  )

  // Become the service worker for clients which do not already have a service worker
  return self.clients.claim()
})

const broadcast = new BroadcastChannel("notification-action")

self.addEventListener("notificationclose", (event) => {
  broadcast.postMessage({
    action: "COMPLETE_TASK",
    payload: {
      taskId: event.notification.data.id,
    },
  })
})

self.addEventListener("notificationclick", (event) => {
  // switch (event.action) {
  //   case "DISMISS": {
  //     event.notification.close()
  //     return
  //   }
  //   case "COMPLETE_TASK": {
  //     broadcast.postMessage({
  //       action: "COMPLETE_TASK",
  //       payload: {
  //         taskId: event.notification.data.id,
  //       },
  //     })
  //     event.notification.close()
  //     return
  //   }
  // }
})
