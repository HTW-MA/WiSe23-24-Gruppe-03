<template>
  <nav class="navbar">
    <div class="container-fluid">
      <b class="navbar-brand">Mensa App</b>
    </div>
    <div>
      <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/Budget">Budget</a>
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
  background-color: red;
}
</style>
