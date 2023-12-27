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

          if (e.pointers.length > 1) {
            e.preventDefault();
          }
        });

        // Allow scrolling for single touch
        mc.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }));
        mc.get('pan').set({ enable: true });
        mc.on('pan', function(e) {
          if (e.pointers.length === 1) {
            container.value.scrollLeft -= e.deltaX;
            container.value.scrollTop -= e.deltaY;
          }
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
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: auto;
}

.heat-image-container img {
  width: auto;
  height: 100vh;
  display: block;
  transform-origin: center;
}
</style>
