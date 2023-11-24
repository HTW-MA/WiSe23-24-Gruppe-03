<script lang="js">
import PopUp from "@/components/PopUp.vue";


export default {
  name: 'BudgetComponent',
  components: {PopUp},
  methods: {
    closeModal() {
      setTimeout(() => {
        this.$refs.myModal.close(); // Assuming you have a method named close() in your modal component
      }, 4000);
      //const modal = document.getElementById("popupId")
    }
  }
}

</script>

<template>
  <!-- Click on img triggers modal -->
  <img v-on:click="closeModal" src="../assets/NFC_Placeholder.png" alt="NFC" data-bs-toggle="modal" data-bs-target="#exampleModal" style="cursor: pointer">
  <!-- Modal -->
  <PopUp ref="test"/>
</template>

<style scoped>


</style>
