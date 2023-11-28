<template>

  <single-meal :meal="mealDetails"></single-meal>
</template>

<script>
import { useRouter} from "vue-router";
import {ref} from "vue";

import SingleMeal from "@/components/SingleMeal.vue";




export default {
  name: 'MealComponent',
  components: {SingleMeal},
  methods: {useRouter},
  props: {
    SingleMeal,
    meal: Object,


  },

  setup() {



    const mealDetails = ref(null);



    return {

      mealDetails,



    };
  },
};
</script>