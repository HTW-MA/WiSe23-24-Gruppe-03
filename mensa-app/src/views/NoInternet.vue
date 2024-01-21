<template>
  <div class="image-container">
    <img :src="heat" alt="Heat Image" />
  </div>
</template>

<script>
import heat from '../assets/dinoooo.png';

export default {
  name: 'NoInternet',
  data() {
    return {
      heat
    };
  }
};
</script>

<style>
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
  height: auto;
  width: auto;
}
</style>
