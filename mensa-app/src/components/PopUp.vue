<script lang="js">

export default {
  name: 'PopUp',
  methods: {
    close() {
      const close = () => {
        // Soll angeblich sich selbst aus der DOM entfernen, funktioniert aber nicht
        this.$root.$el.parentNode.removeChild(this.$root.$el)
        //root.$destroy();
        //root.$el.parentNode.removeChild(root.$el);
      };
      return { close };
    }
  }
}
</script>

<template>
  <div ref="PopUp" class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Bitte scannen Sie ihre Karte</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
