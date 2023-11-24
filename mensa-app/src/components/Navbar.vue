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
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Navbar'
}
</script>

<style scoped>
.navbar{
  background-color: #f57373;
}
.nav-item {
  display: flex;
  align-items: center; /* Optional, for vertical alignment */
}

.nav-link {
  margin-right: 10px; /* Optional, for some space between the links */
}

</style>
