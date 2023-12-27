<template>
  <div class="heat-image-container">
    <img src="@/assets/heat.png" alt="Heat Image" />
  </div>
</template>

<script>
export default {
  name: 'NoInternet'
};
</script>

<style>
.heat-image-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-x: auto;
}

.heat-image-container img {
  width: auto;
  height: 100vh;
  display: block;
}
</style>
