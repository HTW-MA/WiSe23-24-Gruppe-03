<template>
  <Header/>
  <router-view/>
  <navbar/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Home from './views/HomeComponent.vue'
import Navbar from "@/components/Navbar.vue";
import Header from "@/components/Header.vue";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBnM08BvJ7HUc4sDMBzE6yLUrTXSEhUrMw",
  authDomain: "mensa-app-messaging.firebaseapp.com",
  projectId: "mensa-app-messaging",
  storageBucket: "mensa-app-messaging.appspot.com",
  messagingSenderId: "6695932865",
  appId: "1:6695932865:web:720dd57e4f99deca119540",
  measurementId: "G-0HFP6DNF3K"
};

const app = initializeApp(firebaseConfig); //eslint-disable-line



// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
const messaging = getMessaging();
onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  // ...
});
getToken(messaging, { vapidKey: 'BLaAKtfevr-_XQcO_zN9u18aEuh-KRL9qQ-0z_k8qmk5HSvaNaiFFJZ2QdDRGuADS4cVq6O2RnFZXffWYnjeseA' }).then((currentToken) => {
  if (currentToken) {
    console.log("Token is:", currentToken)
    localStorage.setItem("User-Token", currentToken)
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});

@Options({
  components: {
    Navbar,
    Home,
    Header
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}

/*
nav {
  padding: 2vw;
  top: 0;
  background-color: red;
  position: fixed;
  width: 100%;
  z-index: 1000;
}
 */


nav a {
  font-weight: bold;
  color: #2c3e50;
}


nav a.router-link-exact-active {
  color: #42b983;
}
</style>
