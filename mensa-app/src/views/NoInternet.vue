<template>
  <div class="heat-image-container" ref="container">
    <img src="@/assets/heat.png" alt="Heat Image" ref="image" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Hammer from 'hammerjs';

export default {
  name: 'NoInternet',

  setup() {
    const container = ref(null);
    const image = ref(null);

    onMounted(() => {
      if (container.value && image.value) {
        const mc = new Hammer.Manager(container.value);
        mc.add(new Hammer.Pinch({ threshold: 0 }));

        let lastScale = 1;
        mc.on('pinchstart pinchmove', function (e) {
          if (e.type === 'pinchstart') {
            lastScale = e.scale;
          }

          const scale = lastScale * e.scale;
          image.value.style.transform = `scale(${scale})`;
        });
      }
    });

    return {
      container,
      image
    };
  }
};
</script>

<style>
.heat-image-container {
  overflow: hidden;
  touch-action: none;
}

.heat-image-container img {
  width: 100vw;
  height: auto;
  display: block;
  transform-origin: center;
}
</style>
