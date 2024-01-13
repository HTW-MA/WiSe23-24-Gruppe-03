<template>
  <nav class="navbar navbar-expand-lg fixed-bottom">
    <div class="container-fluid">
      <a class="navbar-brand" href="/Profile">
        <img src="../assets/ProfilIcon.png" alt="Profil" width="30" height="30">
      </a>
      <a class="navbar-brand" href="/Budget">
        <img src="../assets/NFC.png" alt="Budget" width="30" height="30">
      </a>
      <a class="navbar-brand" href="/">
        <img src="../assets/HomeIcon.png" alt="Home" width="30" height="30">
      </a>
      <a class="navbar-brand" href="/favorites">
        <img src="../assets/FavoritenIcon.png" alt="Favoriten" width="30" height="30">
      </a>
    </div>
  </nav>
</template>

<script>
import { onMounted, watch } from 'vue';
import { changeColorScheme } from '@/utils';
import store from "@/store";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Navbar',

  setup() {

    onMounted(() => {
      changeColorScheme(store.state.selectedCanteen, 'backgroundColor', '.navbar');

      let canteens = ['655ff175136d3b580c970f7b', '655ff175136d3b580c970f7d', '655ff175136d3b580c970f7e', '655ff175136d3b580c970f7f', '655ff175136d3b580c970f86', '655ff175136d3b580c970f87', '655ff176136d3b580c970fa0', '655ff176136d3b580c970f9d', '655ff176136d3b580c970f9e', '655ff176136d3b580c970f9f', '655ff176136d3b580c970f9c', '655ff176136d3b580c970fa1', '655ff175136d3b580c970f93', '655ff175136d3b580c970f94', '655ff175136d3b580c970f91']

      if(canteens.includes(store.state.selectedCanteen)) {
        document.querySelectorAll('a > img').forEach(elem => {
          elem.style.filter = "invert(100%)"
        })
      } else {
        document.querySelectorAll('a > img').forEach(elem => {
          elem.style.filter = "invert(0%)"
        })
      }
    });




    watch(() => store.state.selectedCanteen, (newCanteen) => {
      changeColorScheme(newCanteen, 'backgroundColor', '.navbar');

      let canteens = ['655ff175136d3b580c970f7b', '655ff175136d3b580c970f7d', '655ff175136d3b580c970f7e', '655ff175136d3b580c970f7f', '655ff175136d3b580c970f86', '655ff175136d3b580c970f87', '655ff176136d3b580c970fa0', '655ff176136d3b580c970f9d', '655ff176136d3b580c970f9e', '655ff176136d3b580c970f9f', '655ff176136d3b580c970f9c', '655ff176136d3b580c970fa1', '655ff175136d3b580c970f93', '655ff175136d3b580c970f94', '655ff175136d3b580c970f91']

      if(canteens.includes(newCanteen)) {
        document.querySelectorAll('a > img').forEach(elem => {
          elem.style.filter = "invert(100%)"
        })
      } else {
        document.querySelectorAll('a > img').forEach(elem => {
          elem.style.filter = "invert(0%)"
        })
      }
    });


  },
}
</script>

<style scoped>
.navbar {
  background-color: var(--navbar-bg-color);
}

:root {
  --navbar-bg-color: #f57373;
  --navbar-img-inversion: 0%
}

img {
  filter: invert(var(--navbar-img-inversion));
}

.nav-item {
  display: flex;
  align-items: center;
}

.nav-link {
  margin-right: 10px;
}
</style>
