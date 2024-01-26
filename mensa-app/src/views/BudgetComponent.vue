<script lang="js">
//Nutzen falls es mit dem NDEFReader nicht klappen sollte
//import NFC from '@ionic-native/nfc';

//import NDEFReader from '@types/w3c-web-nfc';
//import NDEFRecord from '@types/w3c-web-nfc';
//import NDEFMessage from '@types/w3c-web-nfc';
// import {Modal} from "bootstrap";
import {getMessaging} from "firebase/messaging";
import router from "../../router";
import {onMounted} from "vue";

export default {
  name: 'BudgetComponent',


  data () {
    return {
      budgetGescannt: false,
      popUpShown: true,
      betrag: localStorage.getItem("Betrag") || -1,
      betragDate: localStorage.getItem("Timestamp") || null,
      target: "Icon",
      scanErfolgreich: "noch nicht"
    }
  },
  setup(){
    const navigateToProfile = () => {
      router.push('/Profile');
    };
    onMounted(() => {
      if ( localStorage.getItem('selectedCanteen') === null) {
        navigateToProfile(); // Or any other route
      }
    });

  },
  methods: {
    clearBudget() {
      localStorage.removeItem("Betrag")
    },
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

    testGeoLoc() {
      if ('geoLocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          console.log(position.coords.longitude)
          console.log(position.coords.latitude)
        },
        error => {
          console.log(error)
        })
      } else {
        console.log("Keine GeoLoc")
      }
    },

    readCard() {
      console.log("Read Card aufgerufen")
      this.scanErfolgreich = 'noch nicht'
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
            this.scanErfolgreich = 'ja'
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
                    console.log("=== data ===/n" + decoder.decode(record.data));
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
          this.scanErfolgreich = 'noch nicht'
        });
      } else {
        console.log("NDEFReader nicht erkannt")
        this.scanErfolgreich = 'nein'
      }
      // setTimeout(() => {
      //   console.log("Vor dem Hide")
      //   const test = new Modal(document.getElementById("exampleModal"))
      //   test.dispose()
      //   console.log("Nach dem Hide")
      // }, 5000)
    },

    sendNotification() {
      /*
      //Mit Admin
      //var admin = require("firebase-admin"); Bereits importiert

      var serviceAccount = require("../../../mensa-app-messaging-firebase-adminsdk-rzx4r-938c33982d.json");

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });

      // This registration token comes from the client FCM SDKs.
      const registrationToken = localStorage.getItem("User-Token");

      const message = {
        notification: {
          title: "Test",
          body: "Test"
        },
        token: registrationToken
      };

// Send a message to the device corresponding to the provided
// registration token.
      admin.messaging().send(message)
          .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
          })
          .catch((error) => {
            console.log('Error sending message:', error);
          });
      */



      //Ohne Admin
      const registrationToken = localStorage.getItem("User-Token");

      const message = {
        notification: {
          title: "Test",
          body: "Test"
        },
        token: registrationToken
      };

      // Send a message to the device corresponding to the provided
      // registration token.
      getMessaging().send(message)
        .then((response) => {
          // Response is a message ID string.
          console.log('Successfully sent message:', response);
        })
        .catch((error) => {
          console.log('Error sending message:', error);
        });
    }
  },

  mounted() {

    this.budgetGescannt = this.betrag !== -1;

    if (this.betrag === -1) {
      this.target = "Icon";
    } else {
      this.target = "Budget";
    }

    console.log('Firebase cloud messaging object', this.messaging)
  }
}

</script>

<template>
  <br>
  <br>
  <br>
<!--  <div class="test">-->
<!--    <button v-on:click="sendNotification">send Message - funktioniert nicht</button>-->
<!--  </div>-->
  <div id="Hinweistext">
    <p class="budget-text">Klicken Sie auf das Icon um ihr Budget zu scannen.</p>
  </div>
  <div class="budget-container">
    <!-- Click on img triggers modal -->
    <div v-if="!budgetGescannt">
      <img id="nfc" v-on:click="readCard" src="../assets/NFC.png" alt="NFC" class="budget-icon" data-bs-toggle="modal" data-bs-target="#exampleModal" style="cursor: pointer">
    </div>
    <div v-if="budgetGescannt" v-on:click="readCard" data-bs-toggle="modal" data-bs-target="#exampleModal" style="font-size: 40px">
      {{betrag}} €
    </div>
  </div>
  <div>
    <button v-on:click="clearBudget">Budget löschen</button>
  </div>

  <!-- Modal -->
<!--  <PopUp ref="My-Modal"/>-->
  <div ref="PopUp" class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div v-if="scanErfolgreich !== 'nein'"><h1 class="modal-title fs-5" id="exampleModalLabel">Bitte scannen Sie ihre Karte</h1></div>
          <div v-if="scanErfolgreich === 'nein'"><h1 class="modal-title fs-5" id="exampleModalLabel">Es scheint ein Fehler auf getreten zu sein.</h1></div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="scanErfolgreich === 'noch nicht'">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div v-if="scanErfolgreich === 'ja'">
            <img src="../assets/Häckchen.png" width="100" height="100">
          </div>
          <div v-if="scanErfolgreich === 'nein'">
            <h5>Prüfen Sie ob Ihr Gerät NFC unterstützt.</h5>
<!--            <img src="../assets/Kreuz.png" width="100" height="100">-->
          </div>
          <!--          An dieser stelle vielleicht an Häckchen oder einen Bestätigungstext generieren abhängig von budgetGescannt-->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Allgemeine Stile, die nicht bildschirmgrößenspezifisch sind */
.budget-container {
  text-align: center;
  padding-top: 60px; /* Angenommen Ihre Navbar ist 60px hoch */
  padding-bottom: 60px;
}

@media only screen and (orientation: landscape){
  .budget-icon {
    width: 25%;
  }
}

@media only screen and (orientation: portrait) {
  .budget-icon {
    width: 50%; /* Standardbreite für größere Bildschirme */
  }
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
    padding-top: 30px;
  }

  .budget-icon {
    width: 25%; /* Prozentsatz der Breite des Elternelements, anpassbar */
  }

  .budget-text {
    font-size: 16px; /* Angepasste Schriftgröße für mobile Geräte */
  }
}
</style>
