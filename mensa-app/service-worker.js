import { precacheAndRoute } from 'workbox-precaching';
import heat from '/src/assets/dinoooo.png';

precacheAndRoute(self.__WB_MANIFEST);

// The heat image will be precached, ensuring it's available offline
const precacheImages = [
    { url: heat, revision: null }
];
precacheAndRoute(precacheImages);

// Additional code goes here.

const responseContent = `
<html>
<!--  <body style="text-align: center; background-color: #eee; color: #000;">-->
<!--    <h1>Sie können uns leider nicht erreichen</h1>-->
<!--    <p>Es scheint, dass es ein Problem mit Ihrer Internetverbindung gibt.</p>-->
<!--    <p>Bitte versuchen Sie es erneut, sobald Sie eine stabile Internetverbindung haben.</p>-->

<!--  </body>-->
<head>
    <style>
      body, html {
        margin: 0;
        padding: 0;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        background-color: black;
      }
      img.fullscreen-img {
        width: 100vw; 
        height: 100vh; 
        object-fit: contain;
      }
    </style>
  </head>
  <body>
    <div class="image-container">
      <img src="${heat}" alt="Heat Image" class="fullscreen-img">
    </div>
  </body>
</html>`;

self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return new Response(responseContent, { headers: { 'Content-Type': 'text/html' } });
        })
    );
});