<template>

  <p>Bitte Kantine auswählen:</p>
  <p>ToDo: Kantine für mich mit GPS finden - auch fehlermeldung machen</p>
  <div>
    <select v-model="selectedCanteen">
      <option v-for="canteen in canteens" :value="canteen.id" :key="canteen.id">
        {{ canteen.name }} - {{ canteen.address.street }}
      </option>
    </select>
    <p></p>
    <p>Für genauere Preisinformationen. Aber Achtung: Diese Informationen sind unverbindlich:</p>
    <div>
      <label>
        <input type="radio" value="Studierende" v-model="selectedRole"> Studierende
      </label>
      <label>
        <input type="radio" value="Angestellte" v-model="selectedRole"> Angestellte
      </label>
      <label>
        <input type="radio" value="Gäste" v-model="selectedRole"> Gäste
      </label>
    </div>
    <p></p>
    <p>Was kommt bei dir auf den Teller? Achtung: Veganer bekommen keine vegetarischen Gerichte angezeigt!</p>
    <div>
      <label>
        <input type="radio" value="Allesfresser" v-model="selectedDiet"> Allesfresser
      </label>
      <label>
        <input type="radio" value="Vegetarier" v-model="selectedDiet"> Vegetarier
      </label>
      <label>
        <input type="radio" value="Veganer" v-model="selectedDiet"> Veganer
      </label>
      <p></p>
      <p>Sollen wir dir helfen? Wir müssen den Nachtisch nicht anzeigen...</p>
      <div>
        <label>
          <input type="radio" value="tooFat" v-model="loseWeight"> Ja
        </label>
        <label>
          <input type="radio" value="skinnyAF" v-model="loseWeight"> Nein
        </label>
      </div>
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
import { ref, onMounted, computed, watch } from 'vue';
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





    const router = useRouter()
    const selectedRole = ref(localStorage.getItem('selectedRole') || '');
    const selectedDiet = ref(localStorage.getItem('selectedDiet') || '');
    const selectedCanteen = ref<string | null>(null);
    const canteens = ref<Canteen[]>([]);
    const loseWeight = ref (localStorage.getItem('loseWeight')|| '');

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
        console.log(canteens.value)
      } catch (error) {
        console.log(error);
      }
    };

    const updateButtonColor = () => {
       changeColorScheme(store.state.selectedCanteen, 'backgroundColor', '.btn-inactive');
    };
    watch(() => store.state.selectedCanteen, updateButtonColor);

    onMounted(async () => {
      try{
        const storedCanteens = await db.canteens.toArray();
        if (storedCanteens.length > 0) {
          canteens.value = storedCanteens;
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

    return { selectedRole, selectedDiet, selectedCanteen, canteens, confirmSelection,allChoicesMade, router, generateTimestampedHex,loseWeight};
  }
};
</script>


<style>
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


</style>

