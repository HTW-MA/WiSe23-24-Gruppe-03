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
    });




    watch(() => store.state.selectedCanteen, (newCanteen) => {
      changeColorScheme(newCanteen, 'backgroundColor', '.navbar');
    });
  }
}
</script>

<template>
  <nav class="navbar navbar-expand-lg fixed-top">
    <div class="container">
      <img src="../assets/logo.png" alt="Logo" width="30" height="30">
      Campus Kantine
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: var(--navbar-bg-color);
}

:root {
  --navbar-bg-color: #f57373;
  --navbar-img-inversion: 0%
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
