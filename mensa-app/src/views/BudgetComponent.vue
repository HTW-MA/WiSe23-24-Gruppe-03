<script lang="js">
import PopUp from "@/components/PopUp.vue";
//import { useGeolocation } from '@vueuse/core'

//const { coords, locatedAt, error, resume, pause } = useGeolocation()
//Nutzen falls es mit dem NDEFReader nicht klappen sollte
//import NFC from '@ionic-native/nfc';

//import NDEFReader from '@types/w3c-web-nfc';
//import NDEFRecord from '@types/w3c-web-nfc';
//import NDEFMessage from '@types/w3c-web-nfc';


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
    },

    readCard() {
      if ('NDEFReader' in window) {
        console.log("NDEFReader erkannt")
        // eslint-disable-next-line
        const ndef = new NDEFReader();
        ndef.scan().then(() => {
          console.log("Scan started successfully.");
          ndef.onreadingerror = () => {
            console.log("Cannot read data from the NFC tag. Try another one?");
          };
          ndef.onreading = event => {
            console.log("NDEF message read.");
            console.log(event)
            this.betrag = event.message
            this.budgetGescannt = true
          };
        }).catch(error => {
          console.log(`Error! Scan failed to start: ${error}.`);
        });
      } else {
        console.log("NDEFReader nicht erkannt")
      }
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
    <img class="center fit" v-on:click="readCard" src="../assets/NFC.png" alt="NFC" data-bs-toggle="modal" data-bs-target="#exampleModal" style="cursor: pointer">
  </div>
  <div v-if="budgetGescannt">
    {{betrag}}
  </div>
<!--  <div v-if="!budgetGescannt">-->
<!--    <img v-on:click="openModal" src="../assets/NFC_Placeholder.png" alt="NFC" style="cursor: pointer">-->
<!--  </div>-->

  <!-- Modal -->
  <div v-if="popUpShown">
    <PopUp ref="My-Modal"/>
  </div>
  <div>
    Ich habe was geändert: 7
    <br>
    {{betrag}}
    <br>
    {{budgetGescannt}}
  </div>
</template>

<style scoped>
  * {
    padding: 0;
    margin: 0;
  }
  .fit { /* set relative picture size */
    max-width: 30%;
    max-height: 30%;
  }
  .center {
    display: block;
    margin: auto;
  }
</style>
