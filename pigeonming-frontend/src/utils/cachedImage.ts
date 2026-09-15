const imageBlobs = new Map<string, Promise<Blob>>()

const loadImageBlob = async (url: string) => {
  let cache: Cache | undefined
  let response: Response | undefined

  if ('caches' in window) {
    try {
      cache = await caches.open('pigeonming-carousel-images')
      response = await cache.match(url)
    } catch {
      cache = undefined
    }
  }

  if (!response?.ok) {
    response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to load image: ${url}`)

    if (cache) {
      try {
        await cache.put(url, response.clone())
      } catch {
        // Render the fetched image even when browser storage is unavailable.
      }
    }
  }

  return response.blob()
}

export const getCachedImageBlob = (url: string) => {
  const existing = imageBlobs.get(url)
  if (existing) return existing

  const loading = loadImageBlob(url).catch((error: unknown) => {
    imageBlobs.delete(url)
    throw error
  })
  imageBlobs.set(url, loading)
  return loading
}
