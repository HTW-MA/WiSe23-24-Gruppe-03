<script lang="js">

import { onMounted, watch } from 'vue';
import { changeColorScheme } from '@/utils';
import store from "@/store";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Header',

  setup() {

    onMounted(() => {
      changeColorScheme(store.state.selectedCanteen, 'backgroundColor', '.navbar');

      let canteens = ['655ff175136d3b580c970f7b', '655ff175136d3b580c970f7d', '655ff175136d3b580c970f7e', '655ff175136d3b580c970f7f', '655ff175136d3b580c970f86', '655ff175136d3b580c970f87', '655ff176136d3b580c970fa0', '655ff176136d3b580c970f9d', '655ff176136d3b580c970f9e', '655ff176136d3b580c970f9f', '655ff176136d3b580c970f9c', '655ff176136d3b580c970fa1', '655ff175136d3b580c970f93', '655ff175136d3b580c970f94', '655ff175136d3b580c970f91']

      if(canteens.includes(store.state.selectedCanteen)) {
        document.querySelectorAll('.navbar').forEach(elem => {
          elem.style.color = "white"
        })
      } else {
        document.querySelectorAll('.navbar').forEach(elem => {
          elem.style.color = "black"
        })
      }
    });




    watch(() => store.state.selectedCanteen, (newCanteen) => {
      changeColorScheme(newCanteen, 'backgroundColor', '.navbar');

      let canteens = ['655ff175136d3b580c970f7b', '655ff175136d3b580c970f7d', '655ff175136d3b580c970f7e', '655ff175136d3b580c970f7f', '655ff175136d3b580c970f86', '655ff175136d3b580c970f87', '655ff176136d3b580c970fa0', '655ff176136d3b580c970f9d', '655ff176136d3b580c970f9e', '655ff176136d3b580c970f9f', '655ff176136d3b580c970f9c', '655ff176136d3b580c970fa1', '655ff175136d3b580c970f93', '655ff175136d3b580c970f94', '655ff175136d3b580c970f91']

      if(canteens.includes(newCanteen)) {
        document.querySelectorAll('.navbar').forEach(elem => {
          elem.style.color = "white"
        })
      } else {
        document.querySelectorAll('.navbar').forEach(elem => {
          elem.style.color = "black"
        })
      }
    });
  }
}
</script>

<template>
  <nav class="navbar navbar-expand-lg fixed-top">
    <div class="container">
      <img src="../assets/logo.png" alt="Logo" width="30" height="30">
      Forscher Futter
    </div>
  </nav>
</template>

<style scoped>

.navbar {
  background-color: var(--navbar-bg-color);
  color: var(--navbar-font-color);
}

:root {
  --navbar-bg-color: #f57373;
  --navbar-img-inversion: 0%;
  --navbar-font-color: black;
}

.container {
  font-size: 18px;
  font-weight:bold;
}

.container img {
  position: absolute; left: 5px; top: 7px;
}

img {
  margin-left: 10px;
}

.nav-item {
  display: flex;
  align-items: center;
}

.nav-link {
  margin-right: 10px;
}
</style>
