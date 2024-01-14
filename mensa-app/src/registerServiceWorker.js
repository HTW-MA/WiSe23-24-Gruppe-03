/* eslint-disable no-console */
import { register } from 'register-service-worker'

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
    });

    register('../public/firebase-messaging-sw.js', {
        ready () {
            console.log(
                'Push notifications are being served by a service worker.\n' +
                'For more details, visit https://goo.gl/AFskqB'
            )
        },
        registered () {
            console.log('firebase-messaging-sw has been registered.')
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


//
// const CACHE_NAME = 'my-vue-app-cache';
//
// // Install Service Worker
// self.addEventListener('install', function(event) {
//     event.waitUntil(
//         caches.open(CACHE_NAME).then(function(cache) {
//             return cache.addAll([
//                 '/',
//                 '../dist/index.html',
//                 '..dist/manifest.json',
//                 '../dist/js/app.d13bd54e.js', // Anpassen, je nachdem, wo Ihre Haupt-JavaScript-Datei liegt
//                 '../dist/css/app.28b67a38.css', // Anpassen, je nachdem, wo Ihre Haupt-CSS-Datei liegt
//                 '../dist/img/NFC_Placeholder.9a6612f7.png', // Anpassen, je nachdem, wo Ihre Bilder liegen
//                 '../dist/img/icons/android-chrome-192x192.png'
//                 // Fügen Sie hier alle anderen Ressourcen hinzu, die Sie cachen möchten.
//             ]);
//         })
//     );
// });
//
// // Intercept network requests and serve from cache
// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//         caches.match(event.request).then(function(response) {
//             return response || fetch(event.request);
//         })
//     );
// });


