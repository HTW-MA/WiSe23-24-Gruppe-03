<template>


  <nav class="navbar">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">Mensa App</a>
      <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/Budget">Budget</a>
          <a class="nav-link active" aria-current="page" href="/Profile">Profil</a>
        </li>
      </ul>
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
