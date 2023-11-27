/* eslint-disable no-console */

import { register } from 'register-service-worker'

export type {};
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = "gih-cache";
const CACHED_URLS = [
    "/assets/annalena.png",
    "/assets/chicken.png",
    "/assets/logo.png",
    "/assets/NFC_Placeholder.png",
    "/assets/vegan.png",
    "/assets/veggie.png",
    "/app.js",
    "/views/BudgetComponent.vue",
    "/App.vue",
    "/views/HomeComponent.vue",
    "/SelectOptions.vue",
    "/components/Navbar.vue"
];

self.addEventListener("install", function(event) {
    // Cache everything in CACHED_URLS. Installation fails if anything fails to cache
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(CACHED_URLS);
        })
    );
});

self.addEventListener("fetch", function (event) {
    const requestURL = new URL(event.request.url);

    if (requestURL.pathname === "/") {
        caches.open(CACHE_NAME).then(function (cache) {
            // @ts-ignore
            return cache.match("/views/HomeComponent.vue").then(function (cachedResponse) {
                const fetchPromise = fetch("/views/HomeComponent.vue").then(function (networkResponse) {
                    cache.put("/views/HomeComponent.vue", networkResponse.clone());
                });
                return cachedResponse || fetchPromise;
            });
        })
    } else if (
        CACHED_URLS.includes(requestURL.href) ||
        CACHED_URLS.includes(requestURL.pathname)
    ) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function (cache) {
                return cache.match(event.request).then(function (response) {
                    return response || fetch(event.request);
                });
            })
        );
    }
});

if (process.env.NODE_ENV === 'production') {
    register(`${process.env.BASE_URL}service-worker.js`, {
        ready () {
            console.log(
                'App is being served from cache by a service worker.\n' +
                'For more details, visit https://goo.gl/AFskqB'
            )
        },
        registered () {
            console.log('Service worker has been registered.')
        },
        cached () {
            console.log('Content has been cached for offline use.')
        },
        updatefound () {
            console.log('New content is downloading.')
        },
        updated () {
            console.log('New content is available; please refresh.')
        },
        offline () {
            console.log('No internet connection found. App is running in offline mode.')
        },
        error (error) {
            console.error('Error during service worker registration:', error)
        }
    })
}
