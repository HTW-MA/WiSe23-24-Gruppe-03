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
import {onMounted,watch} from "vue";
import store from "@/store";


export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Navbar',

  setup() {
    function changeColorScheme() {
      const selectedCanteen = store.state.selectedCanteen;
      let navbarColor;

      switch (selectedCanteen) {
        case '655ff175136d3b580c970f83':
          navbarColor = '#5b89b0';
          break;
        case '655ff175136d3b580c970f80':
          navbarColor = '#76B900';
          break;
        default:
          navbarColor = '#f57373';
          break;
      }

      document.documentElement.style.setProperty('--navbar-bg-color', navbarColor);
    }

    onMounted(() => {
      changeColorScheme();
    });


    watch(() => store.state.selectedCanteen, () => {
      changeColorScheme();
    });

    return { changeColorScheme };
  },
}
</script>
<style scoped>
.navbar{
  background-color: var(--navbar-bg-color);
}
:root{
  --navbar-bg-color:#f57373;
}



.nav-item {
  display: flex;
  align-items: center;
}

.nav-link {
  margin-right: 10px;
}

</style>
