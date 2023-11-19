<script lang="ts">

export default {
  name: 'BudgetComponent',
  methods: {
    closeModal() {
      //setTimeout(function() {$('#exampleModal').modal('hide')}, 5000)
      // Hier irgendwie das Modal nach x Sekunden schließen
    }
  }
}

</script>

<template>
  <!-- Click on img triggers modal -->
  <img src="../assets/NFC_Placeholder.png" alt="NFC" data-bs-toggle="modal" data-bs-target="#exampleModal" style="cursor: pointer" v-on:click="closeModal()">

  <!-- Modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
