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
  margin-top: 60px;
}

nav {
  padding: 30px;
  top: -60px;
  background-color: red;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
