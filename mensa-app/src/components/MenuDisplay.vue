<template>
  <!-- Date pickers for start and end dates -->
  <input type="date" v-model="startDate" @change="fetchMenu" />
  <input type="date" v-model="endDate" @change="fetchMenu" />
  <div v-for="(categories, date) in meals" :key="date">
    <h3>{{ date }}</h3>
    <div v-for="(categoryMeals, category) in categories" :key="category">
      <h4>{{ category }}</h4>
      <div v-for="meal in categoryMeals" :key="meal.id">
        <p>{{ meal.name || 'Unbekanntes Gericht' }} - Preis: {{ getPrice(meal) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue';
import axios from 'axios';

export default {
  name: 'MenuDisplay',
  props: {
    selectedCanteen: String,
    selectedRole: String
  },
  setup(props) {
    const startDate = ref(new Date().toISOString().slice(0, 10)); // today's date
    const endDate = ref(new Date().toISOString().slice(0, 10)); // today's date
    const meals = ref([]);

    const fetchMenu = async () => {
      try {
        const response = await axios.get(`https://mensa.projekt-ipa.tech/api/v1/menue?loadingtype=complete&canteenId=${props.selectedCanteen}&startdate=${startDate.value}&enddate=${endDate.value}`, {
          headers: {  'X-API-KEY': process.env.VUE_APP_API_KEY
          }
        });
        const mealsByDateAndCategory = response.data.reduce((acc, dayData) => {
          const mealsByCategory = dayData.meals.reduce((catAcc, meal) => {
            if (!catAcc[meal.category]) {
              catAcc[meal.category] = [];
            }
            catAcc[meal.category].push(meal);
            return catAcc;
          }, {});

          acc[dayData.date] = mealsByCategory;
          return acc;
        }, {});
        meals.value = mealsByDateAndCategory;
      } catch (error) {
        console.error(error);
      }
    };

    // Watchers
    watch(() => props.selectedCanteen, fetchMenu);
    watch(startDate, fetchMenu);
    watch(endDate, fetchMenu);

    // Computed Properties
    const categorizedMeals = computed(() => {
      return meals.value.reduce((acc, meal) => {
        if (!acc[meal.category]) {
          acc[meal.category] = [];
        }
        acc[meal.category].push(meal);
        return acc;
      }, {});
    });

    const getPrice = (meal) => {
      // Check if 'prices' exists and is an array
      if (Array.isArray(meal.prices) && meal.prices.length > 0) {
        const priceObj = meal.prices.find(price => price.priceType === props.selectedRole);
        return priceObj ? priceObj.price : 'Der Betreiber hat leider keinen Preis angegeben :(';
      } else {
        // Handle the case where 'prices' is undefined or empty
        return 'Preisinformation nicht verfügbar';
      }
    };

    return {
      startDate,
      endDate,
      categorizedMeals,
      meals,
      getPrice
    };
  }
};
</script>
