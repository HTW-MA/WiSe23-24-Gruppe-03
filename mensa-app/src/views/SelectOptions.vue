<template>



  <div>
    <Label>Bitte Kantine auswählen:</Label>
    <select v-model="selectedCanteen">
      <option v-for="canteen in canteens" :value="canteen.id" :key="canteen.id">
        {{ canteen.name }} - {{ canteen.address.street }}
      </option>
    </select>
    <p></p>
    <Label>Für genauere Preisinformationen. Aber Achtung: Diese Informationen sind unverbindlich:</Label>

    <div>
      <label>Ich bin ein:</label>
      <p></p>
      <select v-model="selectedRole">
        <option value="Studierende" > Student </option>
        <option value="Angestellte" > Angestellt </option>
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
        <option value="tooFat" > Ja </option>
        <option value="skinnyAF" > Nein </option>
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

    function sortCanteens() {
      canteens.value.sort(function (a, b) {
        return Math.sqrt((länge - a.address.geoLocation.longitude) ** 2 + (breite - a.address.geoLocation.latitude) ** 2) - Math.sqrt((länge - b.address.geoLocation.longitude) ** 2 + (breite - b.address.geoLocation.latitude) ** 2)
      });
    }





    const router = useRouter()
    const selectedRole = ref(localStorage.getItem('selectedRole') || '');
    const selectedDiet = ref(localStorage.getItem('selectedDiet') || '');
    const selectedCanteen = ref<string | null>(null);
    const canteens = ref<Canteen[]>([]);
    const loseWeight = ref (localStorage.getItem('loseWeight')|| '');
    let breite = 0;
    let länge = 0;

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
        sortCanteens();
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
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          breite = position.coords.latitude;
          länge = position.coords.longitude;
          console.log("Breite: " + breite);
          console.log("Länge: " + länge)
        })
      } else {
        console.log("Geht nicht")
      }
      try{
        const storedCanteens = await db.canteens.toArray();
        if (storedCanteens.length > 0) {
          canteens.value = storedCanteens;
          console.log("GeoLocation: " + canteens.value[0].address.geoLocation.longitude)
          sortCanteens();
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
      emptySymbol

    };

  }

};
</script>


<style scoped>
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

  select, label {
    width: 100%;
    margin-bottom: 15px;
  }

  button {
    width: 100%;
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

