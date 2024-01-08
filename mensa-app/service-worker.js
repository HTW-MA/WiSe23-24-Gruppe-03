import {precacheAndRoute} from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);

// Additional code goes here.

var responseContent = "<html>" +
    "<body>" +
    "<style>" +
    "body {text-align: center; background-color: #eee; color: #000;}" +
    "</style>" +
    "<h1>Sie k&ouml;nnen uns leider nicht erreichen</h1>" +
    "<p>Es scheint, dass es ein Problem mit Ihrer Internetverbindung gibt.</p>" +
    "<p>Bitte versuchen Sie es erneut, sobald Sie eine stabile Internetverbindung haben.</p>" +
    "</body>" +
    "</html>";

self.addEventListener("fetch", function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return new Response(responseContent, {headers: {"Content-Type": "text/html"}});
        })
    );
});
