<template>


  <menu-display
      :selectedCanteen="selectedCanteen"
      :selectedRole="selectedRole"
      :selected-diet="selectedDiet">
  </menu-display>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import {useRouter} from "vue-router";
import axios from 'axios';
console.log(process.env)

import MenuDisplay from "@/components/MenuDisplay.vue";



export default defineComponent({
  name: 'HomeComponent',
  components: {MenuDisplay},
  setup() {
    const router = useRouter()
    const selectedRole = ref(localStorage.getItem('selectedRole') || 'defaultRole');
    const selectedDiet = ref(localStorage.getItem('selectedDiet') || 'defaultDiet');
    const selectedCanteen = ref(localStorage.getItem('selectedCanteen') || 'defaultCanteen');
    const canteens = ref([]);


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

    onMounted(() => {
      fetchCanteens();
      const storedRole = localStorage.getItem('selectedRole');
      const storedCanteen = localStorage.getItem('selectedCanteen')
      const storedDiet = localStorage.getItem('selectedDiet');
      if(storedRole && storedCanteen && storedDiet){
        selectedRole.value=storedRole;
        selectedDiet.value=storedDiet;

      }
      else {
        router.push('/Profile');
      }
    });

    return {
      selectedRole,
      selectedCanteen,
      selectedDiet,
      canteens
    };
  }
});
</script>
