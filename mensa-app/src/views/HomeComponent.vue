<template>
  <select v-model="selectedCanteen">
    <option v-for="canteen in canteens" :value="canteen.id" :key="canteen.id">
      {{ canteen.name }} - {{ canteen.address.street }}
    </option>
  </select>

  <!-- Radio buttons for roles -->
  <div>
    <input type="radio" id="student" value="Studierende" v-model="selectedRole">
    <label for="student">Studierende</label>
    <input type="radio" id="employee" value="Angestellte" v-model="selectedRole">
    <label for="employee">Angestellte</label>
    <input type="radio" id="guest" value="Gäste" v-model="selectedRole">
    <label for="guest">Gäste</label>
  </div>

  <!-- Dropdown for canteens -->

  <menu-display :selectedCanteen="selectedCanteen" :selectedRole="selectedRole"></menu-display>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import axios from 'axios';
console.log(process.env)

import MenuDisplay from "@/components/MenuDisplay.vue";


export default defineComponent({
  name: 'HomeComponent',
  components: {MenuDisplay},
  setup() {
    const selectedRole = ref('');
    const selectedCanteen = ref('');
    const canteens = ref([]);

    const fetchCanteens = async () => {
      try {
        const response = await axios.get('https://mensa.projekt-ipa.tech/api/v1/canteen?loadingtype=lazy',  {
          headers: {
            'X-API-KEY': process.env.VUE_APP_API_KEY
          }
        });
        canteens.value = response.data;
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(fetchCanteens);

    return {
      selectedRole,
      selectedCanteen,
      canteens
    };
  }
});
</script>
