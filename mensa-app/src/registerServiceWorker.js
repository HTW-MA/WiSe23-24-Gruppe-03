var responseContent = "<html>" +
    "<body>" +
    "<style>" +
    "body {text-align: center; background-color: #333; color: #eee;}" +
    "</style>" +
    "<h1>Gotham Imperial Hotel</h1>" +
    "<p>There seems to be a problem with your connection.</p>" +
    "<p>Come visit us at 1 Imperial Plaza, Gotham City for free WiFi.</p>" +
    "</body>" +
    "</html>";

self.addEventListener("fetch", function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return new Response(responseContent, {headers: {"Content-Type": "text/html"}});
        })
    );
});


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


