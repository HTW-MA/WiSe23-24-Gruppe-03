importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBnM08BvJ7HUc4sDMBzE6yLUrTXSEhUrMw",
    authDomain: "mensa-app-messaging.firebaseapp.com",
    projectId: "mensa-app-messaging",
    storageBucket: "mensa-app-messaging.appspot.com",
    messagingSenderId: "6695932865",
    appId: "1:6695932865:web:720dd57e4f99deca119540",
    measurementId: "G-0HFP6DNF3K"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );
    // Customize notification here
    // const notificationTitle = payload.notification.title;
    // const notificationOptions = {
    //     body: payload.notification.body,
    //     icon: '/firebase-logo.png'
    // };

    //self.registration.showNotification(notificationTitle, notificationOptions);
});
