<template>
  <nav class="navbar">
    <div class="container-fluid">
      <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Toggle navigation">
        Mensa-App
      </button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="/">Home</a></li>
        <li><a class="dropdown-item" href="/Budget">Budget</a></li>
        <li><a class="dropdown-item" href="/Profile">Profil</a></li>
        <li><a class="dropdown-item" href="/GeoLoc">GeoLocation Test</a></li>
      </ul>
      <div class="collapse navbar-collapse" id="navbarNavDarkDropdown">
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import {onMounted, watch} from 'vue';
import {changeColorScheme} from '@/utils';
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
