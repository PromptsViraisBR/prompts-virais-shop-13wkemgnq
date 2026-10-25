// Service Worker para Prompts Virais (App Shell offline & caching de estáticos)
const CACHE_NAME = 'prompts-virais-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa-192x192.svg',
  '/pwa-512x512.svg',
  '/placeholder.svg',
]

// Instalação do Service Worker: pré-cacheia o app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()),
  )
})

// Ativação: limpa versões antigas de caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  )
})

// Fetch:
// - Requisições para a API / backend PocketBase (/api/* ou chamadas com query): SEMPRE da rede (Network Only / Network First)
// - Requisições de navegação e estáticos: Stale-While-Revalidate com fallback para o cache do app shell
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignora requisições que não são GET (POST, PUT, DELETE)
  if (request.method !== 'GET') {
    return
  }

  // APIs do PocketBase, Mercado Pago, autenticação e chamadas dinâmicas: SEMPRE da rede
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.includes('/_/') ||
    url.origin !== self.location.origin
  ) {
    return
  }

  // Navegação (HTML): Network first com fallback para /index.html (SPA)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE_NAME)
        const cached = await cache.match('/index.html')
        return cached || (await cache.match('/'))
      }),
    )
    return
  }

  // Arquivos estáticos (JS, CSS, imagens, fontes): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            const responseToCache = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache)
            })
          }
          return networkResponse
        })
        .catch(() => cachedResponse)

      return cachedResponse || fetchPromise
    }),
  )
})
