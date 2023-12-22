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
      <a class="navbar-brand" href="#">
        <img src="../assets/FavoritenIcon.png" alt="Favoriten" width="30" height="30">
      </a>
      <a class="navbar-brand" href="/GeoLoc">
        <img src="../assets/GeoLocationIcon.webp" alt="GeoLoc" width="30" height="30">
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
    });




    watch(() => store.state.selectedCanteen, (newCanteen) => {
      changeColorScheme(newCanteen, 'backgroundColor', '.navbar');
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
}

.nav-item {
  display: flex;
  align-items: center;
}

.nav-link {
  margin-right: 10px;
}
</style>
