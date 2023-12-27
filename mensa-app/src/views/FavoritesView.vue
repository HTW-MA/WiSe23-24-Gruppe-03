<template>
  <div v-if="favorites.length > 0" class="container">
    <h2>Lieblingsessen</h2>
    <div v-for="meal in favorites" :key="meal.id" class="meal-item">
      <p class="meal-name">{{ meal.name }}<button @click="deleteMeal(meal.id)" class="delete-button">X</button></p>
      <div class="rating-symbols">
        <img v-for="symbol in getRatingSymbols(meal.mealReviews.averageRating)" :src="symbol" :key="symbol" alt="Rating Symbol" class="rating-symbol">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import fav_db from "@/fav_db";
import {Meal} from "@/types";
import {Ref} from "vue/dist/vue";
export default {
  name: 'FavoritesView',

  setup() {

    const favorites: Ref<Meal[]> = ref([]);

    const deleteMeal = async (mealId:string) => {
      try {
        await fav_db.meal.delete(mealId);
        favorites.value = favorites.value.filter(meal => meal.id !== mealId);
      } catch (error) {
        console.error('Error deleting meal:', error);
      }
    };

    const selectedDiet = ref(localStorage.getItem('selectedDiet') || '');
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

    const getRatingSymbols = (rating:number) => {
      const maxRating = 5;
      let symbols = [];

      for (let i = 1; i <= maxRating; i++) {
        if (i <= Math.floor(rating)) {
          symbols.push(filledSymbol);
        } else if (i - 1 < rating && rating < i) {
          symbols.push(halfSymbol);
        } else {
          symbols.push(emptySymbol);
        }
      }
      return symbols
    }


    async function loadFavorites() {
      const meals = await fav_db.meal.toArray();
      if (meals.length > 0) {
        favorites.value = meals.map(meal => {
          meal.mealReviews = { averageRating: 0,comment: '' };
          return meal;
        });
      }

      for (const meal of favorites.value) {
        try {
          const response = await axios.get(`https://mensa.gregorflachs.de/api/v1/meal?ID=${meal.id}&loadingtype=complete`, {
            headers: { 'X-API-KEY': process.env.VUE_APP_API_KEY }
          });
          meal.mealReviews.averageRating = response.data[0]?.mealReviews[0]?.averageRating;
        } catch (error) {
          console.error('Error fetching meal details:', error);
        }
      }
      favorites.value = [...favorites.value];
    }


    onMounted(loadFavorites);

    return {
      favorites,
      deleteMeal,
      getRatingSymbols,
      filledSymbol,
      halfSymbol,
      emptySymbol,

    };
  }
};
</script>

<style>


</style>
