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
  <p>Für genauere Preisinfos. Aber Achtung: Diese Informationen sind unverbindlich:</p>
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
    </div>


    <p></p>


    <button
        :class="{'btn-active': allChoicesMade, 'btn-inactive': !allChoicesMade}"
        @click="allChoicesMade ? confirmSelection() : null"
    >
      Okay
    </button>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import {useRouter} from "vue-router";

interface Canteen {
  id: number;
  name: string;
  address: {
    street: string;
  };
}

export default {
  name: 'SelectedOptions',
  setup() {
    const router = useRouter()
    const selectedRole = ref<string>('');
    const selectedDiet = ref<string>('');
    const selectedCanteen = ref<number | null>(null);
    const canteens = ref<Canteen[]>([]);


    const allChoicesMade = computed(() => {
      return selectedRole.value !== '' && selectedDiet.value !== '' && selectedCanteen.value !== null;
    });
    const fetchCanteens = async () => {
      try {
        const response = await axios.get('https://mensa.gregorflachs.de/api/v1/canteen?loadingtype=lazy',  {
          headers: {
            'X-API-KEY': process.env.VUE_APP_API_KEY
          }
        });
        canteens.value = response.data;
      } catch (error) {
        console.log(error);
      }
    };

    onMounted(fetchCanteens);

    const confirmSelection = () => {
      // Implement your caching strategy here
      localStorage.setItem('selectedRole', selectedRole.value);
      localStorage.setItem('selectedDiet', selectedDiet.value);
      if (selectedCanteen.value !== null) {
        localStorage.setItem('selectedCanteen', selectedCanteen.value.toString());
      } else {
        localStorage.removeItem('selectedCanteen'); // or localStorage.setItem('selectedCanteen', 'null');
      }
      console.log('Selected Role:', selectedRole.value);
      console.log('Selected Diet:', selectedDiet.value);
      console.log('Selected Canteen:', selectedCanteen.value);
      router.push('/');

    };

    return { selectedRole, selectedDiet, selectedCanteen, canteens, confirmSelection,allChoicesMade, router };
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
  background-color: #76B900; /* Vibrant green when active */
  color: white;
}

.btn-active:hover {
  background-color: #64a000; /* Slightly darker green on hover */
}

.btn-inactive {
  background-color: #cccccc; /* Simple grey when inactive */
  color: #666666;
  cursor: not-allowed;
}

.btn-inactive:hover {
  background-color: #cccccc; /* Remain grey on hover */
}
</style>