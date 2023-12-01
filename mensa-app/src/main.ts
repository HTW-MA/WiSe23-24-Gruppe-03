import { createApp } from 'vue'
import App from './App.vue'
//import './registerServiceWorker_Ignorieren'
import './registerServiceWorker'
import router from "../router";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import store from "./store";


createApp(App).use(router).provide('store', store).mount('#app')


//createApp(App).use(router).mount('#app')


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/registerServiceWorker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}
