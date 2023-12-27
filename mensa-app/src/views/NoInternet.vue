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
  position: relative; /* Relative positioning */
  width: 100%; /* Full width of the container */
  min-height: 100vh; /* Minimum height to cover the full viewport height */
  overflow-x: auto; /* Enable horizontal scrolling */
}

.heat-image-container img {
  width: auto; /* Auto width to maintain aspect ratio */
  height: 100vh; /* Full viewport height */
  display: block; /* Remove default inline styling */
}
</style>
