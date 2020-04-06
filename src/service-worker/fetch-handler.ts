import { CACHE_KEY } from "./constants"

const PUBLIC_FOLDER = `${location.origin}/public`

function cypressRelated(url: string) {
  return /cypress/i.test(url)
}

function shouldResolveToIndexHTML(request: Request) {
  return (
    request.method === "GET" &&
    !request.url.startsWith(PUBLIC_FOLDER) &&
    request.url.startsWith(location.origin) &&
    !/sockjs-node/.test(request.url) &&
    !/\.js$/.test(request.url) &&
    !cypressRelated(request.url)
  )
}

function isJSAsset(request: Request) {
  return (
    request.method === "GET" &&
    !request.url.startsWith(PUBLIC_FOLDER) &&
    request.url.startsWith(location.origin) &&
    !/sockjs-node/.test(request.url) &&
    new RegExp(`^${location.origin}/[^/]*\\.js`).test(request.url) &&
    !cypressRelated(request.url)
  )
}

function isPublicAsset(request: Request) {
  return (
    request.method === "GET" &&
    request.url.startsWith(PUBLIC_FOLDER) &&
    !cypressRelated(request.url)
  )
}

export default async function getResponse(
  event: FetchEvent,
): Promise<Response> {
  const request = event.request

  // Resolve index.html from network then cache
  if (shouldResolveToIndexHTML(request)) {
    try {
      const response = await fetch("/index.html")
      const cache = await caches.open(CACHE_KEY)
      await cache.put("/index.html", response.clone())
      console.log("Recached index.html", request.url)
      return response
    } catch (e) {
      const response = await caches.match("/index.html")
      if (!response) {
        throw Error("Cannot get index.html from cache or network")
      }
      return response
    }
  }

  // Try resolve anything else
  const result = await caches.match(request)
  if (result) {
    return result
  }

  const response = await fetch(request)

  // Cache JS assets
  if (isJSAsset(request) || isPublicAsset(request)) {
    console.log("Caching Asset: ", `${request.method}|${request.url}`)
    const cache = await caches.open(CACHE_KEY)
    cache.put(event.request, response.clone())
  }

  return response
}
