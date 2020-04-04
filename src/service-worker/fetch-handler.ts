import { CACHE_KEY } from "./constants"

const PUBLIC_FOLDER = `${location.origin}/public`

function shouldResolveToIndexHTML(request: Request) {
  return (
    request.method === "GET" &&
    !request.url.startsWith(PUBLIC_FOLDER) &&
    request.url.startsWith(location.origin) &&
    !/sockjs-node/.test(request.url) &&
    !/\.js$/.test(request.url)
  )
}

function isJSAsset(request: Request) {
  return (
    request.method === "GET" &&
    !request.url.startsWith(PUBLIC_FOLDER) &&
    request.url.startsWith(location.origin) &&
    !/sockjs-node/.test(request.url) &&
    /\.js$/.test(request.url)
  )
}

function isPublicAsset(request: Request) {
  return request.method === "GET" && request.url.startsWith(PUBLIC_FOLDER)
}

export default async function getResponse(
  event: FetchEvent,
): Promise<Response> {
  const request = event.request

  if (shouldResolveToIndexHTML(request)) {
    console.log("GET ON DOMAIN", request)
  }

  const result = await caches.match(request)
  if (result) {
    return result
  }

  if (shouldResolveToIndexHTML(request)) {
    const indexHtml = await caches.match("/index.html")
    if (indexHtml) {
      return indexHtml
    }
  }

  const response = await fetch(request)

  if (isJSAsset(request) || isPublicAsset(request)) {
    console.log("Caching Asset: ", `${request.method}|${request.url}`)
    const cache = await caches.open(CACHE_KEY)
    cache.put(event.request, response.clone())
  }

  return response
}
