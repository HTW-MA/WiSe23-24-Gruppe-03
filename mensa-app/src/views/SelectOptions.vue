<template>
  <p></p>

  <div>
    <div v-if="screenWidth < screenHeight">
      <Label>Bitte Kantine auswählen:</Label>
      <p></p>
      <select v-model="selectedCanteen">
        <option v-for="canteen in canteens" :value="canteen.id" :key="canteen.id">
          {{ canteen.name }} - {{ canteen.address.street }}
        </option>
      </select>
      <div>
        <input type="checkbox" id="coding" name="interest" value="coding" v-on:click="checkboxClicked" v-if="geoLocActive"/>
        <label v-if="geoLocActive" for="coding">Nach Entfernung sortieren?</label>
      </div>
    </div>

    <div v-if="screenWidth > screenHeight">
      <Label>Bitte Kantine auswählen:</Label>
      <p></p>
      <select v-model="selectedCanteen">
        <option v-for="canteen in canteens" :value="canteen.id" :key="canteen.id">
          {{ canteen.name }} - {{ canteen.address.street }}
        </option>
      </select>
      <input type="checkbox" id="coding" name="interest" value="coding" v-on:click="checkboxClicked" v-if="geoLocActive"/>
      <label v-if="geoLocActive" for="coding">Nach Entfernung sortieren?</label>
    </div>
<!--    <label class="switch">-->
<!--      <input type="checkbox"/>-->
<!--      <span class="slider round"></span>-->
<!--    </label>-->
    <p></p>
    <Label>Für genauere Preisinformationen. Aber Achtung: Diese Informationen sind unverbindlich:</Label>

    <p></p>

    <div>
      <label>Ich bin ein:</label>
      <p></p>
      <select v-model="selectedRole">
        <option value="Studierende" > Student </option>
        <option value="Angestellte" > Angestellter </option>
        <option value="Gäste" > Gast </option>
      </select>
    </div>

    <p></p>

    <div>
      <label>Ich ernähre mich:</label>
      <p></p>
      <select v-model="selectedDiet">
        <option value="Allesfresser" > ohne Einschränkung </option>
        <option value="Vegetarier" > vegetarisch </option>
        <option value="Veganer" > vegan </option>
      </select>
    </div>

    <p></p>

    <div>
      <label>Desserts anzeigen?</label>
      <p></p>
      <select v-model="loseWeight">
        <option value="skinnyAF" > Ja </option>
        <option value="tooFat" > Nein </option>
      </select>
    </div>


    <p></p>


    <button
        :class="{'btn-active': allChoicesMade, 'btn-inactive': !allChoicesMade}"
        @click="allChoicesMade ? confirmSelection() : null;  this.$emit('refreshNavbar');"
    >
      Okay
    </button>


  </div>



</template>

<script lang="ts">
import axios from 'axios';
import { ref, onMounted, computed, watch} from 'vue';
import {useRouter} from "vue-router";
import db from "@/db";
import {Canteen} from "@/types";
import store from "../store";
import {changeColorScheme} from "@/utils";


export default {
  name: 'SelectedOptions',


  setup() {







    function generateTimestampedHex(len: number):string {
      const timestampHex = Date.now().toString(16);

      const remainingLen = len - timestampHex.length;

      let randomHex = '';
      const characters = '0123456789abcdef';
      for (let i = 0; i < remainingLen; i++) {
        randomHex += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return timestampHex + randomHex;
    }

    const selectedCanteen = ref<string | null>(null);

    function sortCanteensByDistance() {
      canteens.value.sort(function (a, b) {
        return Math.sqrt((länge - a.address.geoLocation.longitude) ** 2 + (breite - a.address.geoLocation.latitude) ** 2) - Math.sqrt((länge - b.address.geoLocation.longitude) ** 2 + (breite - b.address.geoLocation.latitude) ** 2)
      });
      if (canteens.value.length > 0 && canteens.value[0].id) {
        selectedCanteen.value = canteens.value[0].id;
      } else {
        selectedCanteen.value = null;
      }
    }


    function sortCanteensAlphabetically() {
      canteens.value.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    }





    const router = useRouter()
    const selectedRole = ref(localStorage.getItem('selectedRole') || '');
    const selectedDiet = ref(localStorage.getItem('selectedDiet') || '');

    const canteens = ref<Canteen[]>([]);
    const loseWeight = ref (localStorage.getItem('loseWeight')|| '');
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    let breite = 0;
    let länge = 0;
    let notificationSent = false;
    let isCheckboxClicked = false;
    let sorted = 'alphabetically';
    let geoLocActive = true;

    const getUserID = () => {
      let userID = localStorage.getItem('userID');
      if (!userID) {
        userID = generateTimestampedHex(24)
        localStorage.setItem('userID', userID);
      }
      return userID;
    };


    const allChoicesMade = computed(() => {
      return selectedRole.value !== '' && selectedDiet.value !== '' && selectedCanteen.value !== null && loseWeight.value !=='';
    });


    const fetchCanteens = async () => {
      try {
        const response = await axios.get('https://mensa.gregorflachs.de/api/v1/canteen?loadingtype=lazy',  {
          headers: {
            'X-API-KEY': process.env.VUE_APP_API_KEY
          }
        });

        await db.canteens.bulkPut(response.data);
        canteens.value = response.data;
        sortCanteensAlphabetically();
        console.log(canteens.value)
      } catch (error) {
        console.log(error);
      }
    };

    const updateButtonColor = () => {
       changeColorScheme(store.state.selectedCanteen, 'backgroundColor', '.btn-inactive');
    };
    watch(() => store.state.selectedCanteen, updateButtonColor);



    let filledSymbol:string;
    let emptySymbol:string;
    let halfSymbol:string;


    if (selectedDiet.value === "Allesfresser") {
      filledSymbol = require('@/assets/fullChicken.png');
      emptySymbol = require('@/assets/emptyChicken.png');
      halfSymbol = require('@/assets/halfChicken.png')
    } else {
      filledSymbol = require('@/assets/leafFull.png');
      emptySymbol = require('@/assets/leafEmpty.png');
      halfSymbol = require('@/assets/leafHalf.png');
    }


    onMounted(async () => {
      if (!('geolocation' in navigator)) {
        geoLocActive = false
      } else {
        let longitude;
        navigator.geolocation.getCurrentPosition(position => {
          longitude = position.coords.longitude
        })
        if (longitude === null) {
          geoLocActive = false
        }
      }
      try{
        const storedCanteens = await db.canteens.toArray();
        if (storedCanteens.length > 0) {
          canteens.value = storedCanteens;
          sortCanteensAlphabetically();
        } else {
          await fetchCanteens();
        }

        const storedCanteenId = localStorage.getItem('selectedCanteen');
        if (storedCanteenId && canteens.value.some(canteen => canteen.id === storedCanteenId)) {
          selectedCanteen.value = storedCanteenId;
        }

        updateButtonColor();

      }
      catch (error){
        console.log(error)
      }

    });




    const confirmSelection = () => {
      // eslint-disable-next-line no-unused-vars
      const userID = getUserID();
      localStorage.setItem('selectedRole', selectedRole.value);
      localStorage.setItem('selectedDiet', selectedDiet.value);
      localStorage.setItem('loseWeight', loseWeight.value);
      console.log(loseWeight.value)
      if (selectedCanteen.value !== null) {
        localStorage.setItem('selectedCanteen', selectedCanteen.value.toString());
        store.updateSelectedCanteen();
      } else {
        localStorage.removeItem('selectedCanteen');
      }

      router.push('/');


    };

    const checkboxClicked = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          breite = position.coords.latitude;
          länge = position.coords.longitude;
        })
      }

      isCheckboxClicked = !isCheckboxClicked
      if (navigator.geolocation && isCheckboxClicked && sorted === 'alphabetically') {
        sortCanteensByDistance();
        sorted = 'byDistance'
      } else if (navigator.geolocation && !isCheckboxClicked && sorted !== 'alphabetically'){
        sortCanteensAlphabetically()
        sorted = 'alphabetically'
      } else {
        if (!notificationSent) {
          Notification.requestPermission().then(function(permission) {
            if (permission === "granted") {
              navigator.serviceWorker.ready.then(function(registration) {
                registration.showNotification("Sie haben Ihren Standort nicht aktiviert. " +
                    "Daher wird die Liste der Mensen alphabetisch sortiert.");
              });
            }
          });
          notificationSent = true
        }
        if (sorted !== 'alphabetically') {
          sortCanteensAlphabetically()
          sorted = 'alphabetically'
        }
      }
      if (canteens.value.length > 0 && canteens.value[0].id) {
        selectedCanteen.value = canteens.value[0].id;
      } else {
        selectedCanteen.value = null;
      }
    }



    return {
      selectedRole,
      selectedDiet,
      selectedCanteen,
      canteens,
      confirmSelection,
      allChoicesMade,
      router,
      generateTimestampedHex,
      loseWeight,
      halfSymbol,
      filledSymbol,
      emptySymbol,
      checkboxClicked,
      geoLocActive,
      screenWidth,
      screenHeight
    };

  }

};
</script>


<style scoped>
input {
  margin-left: 20px;
}

label {
  margin-left: 5px;
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: var(--toggle-bg-color);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--toggle-box-shadow);
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

:root {
  --toggle-bg-color: '#2196F3';
  --toggle-box-shadow: '#2196F3'
}

.btn-active, .btn-inactive {
  padding: 0px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-active {
  background-color: #f57373;
  color: white;
}


.btn-inactive {
  background-color: #d5d5d5;
  cursor: not-allowed;
}



@media (max-width: 600px) {
  .select-options {
    padding: 10px;
  }

  select {
    width: 100%; /* Stellt sicher, dass das Dropdown-Menü nicht breiter als der Container ist */
    max-width: 300px; /* Setzt eine maximale Breite für das Dropdown-Menü */
    margin-bottom: 15px; /* Fügt Abstand nach unten hinzu */
    font-size: 14px; /* Verkleinert die Schriftgröße für mobile Geräte */
    text-align-last: center; /* Zentriert den ausgewählten Text im Dropdown */
    -moz-text-align-last: center; /* Für Firefox */
  }

  label {
    display: block; /* Labels nehmen ihre eigene Zeile ein */
    margin-bottom: 5px; /* Fügt Abstand unter dem Label hinzu */
  }

  button {
    width: 100%;
    max-width: 300px; /* Setzt eine maximale Breite für den Button */
  }

  .container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .meal-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1em;
  }

  .meal-name {
    margin-bottom: 0.5em;
  }

  .rating-symbols {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }

  .rating-symbol {
    margin-right: 0.3em;
    width: 1em;
    height: auto;
  }

  .delete-button {
    color: red;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1.2em;
  }

  .meal-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .dropdown {
    width: 100%;
  }

}

</style>

