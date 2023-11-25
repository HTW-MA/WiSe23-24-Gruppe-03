<script lang="js">
import PopUp from "@/components/PopUp.vue";
//import * as bootstrap from 'bootstrap';
//window.bootstrap = bootstrap;

export default {
  name: 'BudgetComponent',
  components: {PopUp},
  methods: {
    closeModal() {
      setTimeout(() => {
        console.log("4 Sekunden rum!")
        //Probiert das Modal als JavaScript Objekt zu referenzieren und zu schließen klappt nicht
        //let x = bootstrap.Modal.getOrCreateInstance("PopUp")
        //x.hide()

        // Angeblich gibts ne Standardmethode hide(), funktioniert aber nicht
        //this.$refs["PopUp"].hide()

        // Hab versucht ne eigene close() Methode zu schreiben, finde aber nicht, wie sich ein Modal selber schließen soll
        this.$refs.PopUp.close(); // Assuming you have a method named close() in your modal component

        // Plus das alles funktioniert zwar in js, aber nicht in ts
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
  <PopUp ref="PopUp"/>
</template>

<style scoped>


</style>
