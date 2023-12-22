<template>
  <navbar>

  </navbar>
  <router-view/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import Home from './views/HomeComponent.vue'
import Navbar from "@/components/Navbar.vue";


@Options({
  components: {
    Navbar,
    Home
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
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
