<script lang="js">
import PopUp from "@/components/PopUp.vue";

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
      betrag: localStorage.getItem("Betrag") || -1,
      betragDate: localStorage.getItem("Timestamp") || null,
      target: "Icon"
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
      console.log("Read Card aufgerufen")
      //let mockMessage = new NDEFMessage()

      if ('NDEFReader' in window) {
        console.log("NDEFReader erkannt")
        // eslint-disable-next-line
        const ndef = new NDEFReader();
        ndef.scan().then(() => {
          console.log("Scan started successfully.");
          ndef.onreadingerror = () => {
            console.log("Cannot read data from the NFC tag. Try another one?");
          };
          ndef.onreading = (event) => {
            this.budgetGescannt = true;
            const decoder = new TextDecoder();
            const ndefMessage = event.message;
            for (const record of ndefMessage.records) {
              console.log(`Record type:  ${record.recordType}`);
              console.log(`MIME type:    ${record.mediaType}`);
              console.log(`Record id:    ${record.id}`);
              switch (record.recordType) {
                case "text":
                  for (const record of event.message.records) {
                    console.log("Record type:  " + record.recordType);
                    console.log("MIME type:    " + record.mediaType);
                    console.log("=== data ===\n" + decoder.decode(record.data));
                    this.betrag = decoder.decode(record.data);
                    localStorage.setItem("Betrag", this.betrag);
                    localStorage.setItem("Timestamp", new Date())
                    this.target = "Budget";
                  }
                  break;
                case "url":
                  // TODO: Read URL record with record data.
                  break;
                default:
                  // TODO: Handle other records with record data.
              }
            }
          };
        }).catch(error => {
          console.log(`Error! Scan failed to start: ${error}.`);
        });
      } else {
        console.log("NDEFReader nicht erkannt")
      }
    }
  },

  mounted() {
    this.budgetGescannt = this.betrag !== -1;

    if (this.betrag === -1) {
      this.target = "Icon";
    } else {
      this.target = "Budget";
    }
  }
}

</script>

<template>
  <h1>
    Klicken Sie auf das {{target}} um ihr Budget zu scannen.
  </h1>
  <br>
  <!-- Click on img triggers modal -->
  <div v-if="!budgetGescannt">
    <img class="center fit" v-on:click="readCard" src="../assets/NFC.png" alt="NFC" data-bs-toggle="modal" data-bs-target="#exampleModal" style="cursor: pointer">
  </div>
  <div v-if="budgetGescannt" v-on:click="readCard" data-bs-toggle="modal" data-bs-target="#exampleModal" style="font-size: 40px">
    {{betrag}}€
  </div>

  <!-- Modal -->
  <PopUp ref="My-Modal"/>
</template>

<style scoped>
/* Allgemeine Stile, die nicht bildschirmgrößenspezifisch sind */
.budget-container {
  text-align: center;
  padding-top: 60px; /* Angenommen Ihre Navbar ist 60px hoch */
}

.budget-icon {
  width: 50%; /* Standardbreite für größere Bildschirme */
  margin-bottom: 20px;
}

.budget-text {
  font-size: 18px; /* Standard Schriftgröße */
  margin: 0 20px;
}

/* Stile speziell für mobile Ansichten */
@media (max-width: 600px) {
  .budget-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 60px); /* 100% der Viewport-Höhe abzüglich der Höhe der Navbar */
  }

  .budget-icon {
    width: 80%; /* Prozentsatz der Breite des Elternelements, anpassbar */
  }

  .budget-text {
    font-size: 16px; /* Angepasste Schriftgröße für mobile Geräte */
  }
}
</style>
