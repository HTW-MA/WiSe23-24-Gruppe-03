<template>


  <menu-display
      :selectedCanteen="selectedCanteen"
      :selectedRole="selectedRole"
      :selected-diet="selectedDiet"
      :lose-weight="loseWeight">
  </menu-display>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import {useRouter} from "vue-router";
import axios from 'axios';
console.log(process.env)

import MenuDisplay from "@/components/MenuDisplay.vue";
import db from "@/db";
import {Canteen} from "@/types";



export default defineComponent({
  name: 'HomeComponent',
  components: {MenuDisplay},
  setup() {
    const router = useRouter()
    const selectedRole = ref(localStorage.getItem('selectedRole') || 'defaultRole');
    const selectedDiet = ref(localStorage.getItem('selectedDiet') || 'defaultDiet');
    const selectedCanteen = ref(localStorage.getItem('selectedCanteen') || 'defaultCanteen');
    const loseWeight = ref(localStorage.getItem('loseWeight')|| 'skinnyAF');
    const canteens = ref<Canteen[]>([]);


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

    onMounted(

        async () => {

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
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              console.log("Notifications erlaubt");
            } else {
              console.log("Nope");
            }
          });

      const storedCanteens = await db.canteens.toArray();
      if (storedCanteens.length > 0) {
        canteens.value = storedCanteens;
      } else {
        await fetchCanteens();
      }



    });

    return {
      selectedRole,
      selectedCanteen,
      selectedDiet,
      canteens,
      loseWeight
    };
  }
});
</script>
