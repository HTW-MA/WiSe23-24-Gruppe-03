<script lang="js">
import PopUp from "@/components/PopUp.vue";

export default {
  name: 'BudgetComponent',
  components: {PopUp},
  data () {
    return {
      budgetGescannt: false,
      popUpShown: true,
      betrag: 0
    }
  },
  methods: {
    closeModal() {
      setTimeout(() => {
        console.log("4 Sekunden rum!");
        //Probiert das Modal als JavaScript Objekt zu referenzieren und zu schließen klappt nicht
        //let x = bootstrap.Modal.getOrCreateInstance("PopUp")
        //x.hide()

        // Angeblich gibts ne Standardmethode hide(), funktioniert aber nicht
        //this.$refs["PopUp"].hide()

        // Hab versucht ne eigene close() Methode zu schreiben, finde aber nicht, wie sich ein Modal selber schließen soll
        //this.$refs.PopUp.close(); // Assuming you have a method named close() in your modal component

        // Plus das alles funktioniert zwar in js, aber nicht in ts
      }, 4000);
      //const modal = document.getElementById("popupId")
    },

    openAndCloseModal() {
      setTimeout(function () {
        console.log("5 Sek rum")
        this.popUpShown = false;
      }, 5000)
    }
  }
}

</script>

<template>
  <h1>
    Klicken Sie auf das Icon um ihr Budget zu scannen.
  </h1>
  <br>
  <!-- Click on img triggers modal -->
  <div v-if="!budgetGescannt">
    <img v-on:click="closeModal" src="../assets/NFC_Placeholder.png" alt="NFC" data-bs-toggle="modal" data-bs-target="#exampleModal" style="cursor: pointer">
  </div>
  <div v-if="budgetGescannt">
    {{betrag}}
    <br>
    Betrag aktualisieren
  </div>
<!--  <div v-if="!budgetGescannt">-->
<!--    <img v-on:click="openModal" src="../assets/NFC_Placeholder.png" alt="NFC" style="cursor: pointer">-->
<!--  </div>-->

  <!-- Modal -->
  <div v-if="popUpShown">
    <PopUp ref="My-Modal"/>
  </div>
</template>

<style scoped>


</style>
