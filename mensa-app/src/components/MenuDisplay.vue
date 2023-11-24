<template>
  <!-- Date pickers for start and end dates -->
  <input type="date" v-model="startDate" @change="fetchMenu" />

  <div v-for="(categories, date) in meals" :key="date">
    <h3>{{ date }}</h3>
    <div v-for="(categoryMeals, category) in categories" :key="category">
      <h4>{{ category }}</h4>
      <div v-for="meal in categoryMeals" :key="meal.id">
        <p>{{ meal.name || 'Unbekanntes Gericht' }} - Preis: {{ getPrice(meal) }}
        <img v-if="isBadgePresent(meal.badges, 'Vegan')" :src="veganIcon" alt="Vegan" class="icon-inline">
        <img v-if="isBadgePresent(meal.badges, 'Vegetarisch')" :src="veggieIcon" alt="Vegetarisch" class="icon-inline">
        <img v-if="!isBadgePresent(meal.badges, 'Vegetarisch') && !isBadgePresent(meal.badges, 'Vegan')" :src="chickenIcon" alt="Manly" class="icon-inline">
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, watch, computed, onMounted} from 'vue';
import axios from 'axios';
import veganIcon from '../assets/vegan.png';
import veggieIcon from '../assets/veggie.png'
import chickenIcon from '../assets/chicken.png'

export default {
  name: 'MenuDisplay',
  props: {
    selectedCanteen: String,
    selectedRole: String,
    selectedDiet: String,
  },

  methods:{
    isBadgePresent(badges, badgeName) {
      return badges.some(badge => badge.name === badgeName);
    },
  },

  setup(props) {
    const startDate = ref(new Date().toISOString().slice(0, 10)); // today's date
    const endDate = ref(new Date().toISOString().slice(0, 10)); // today's date
    const meals = ref([]);

    const fetchMenu = async () => {
      try {
        //note: hier wird aus gründen der übersichtlichkeit immer nur 1 Tag angezeigt...
        const response = await axios.get(`https://mensa.gregorflachs.de/api/v1/menue?loadingtype=complete&canteenId=${props.selectedCanteen}&startdate=${startDate.value}&enddate=${startDate.value}`, {
          headers: {  'X-API-KEY':  process.env.VUE_APP_API_KEY
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
        console.log(meals)
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(fetchMenu)

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
      veganIcon,
      veggieIcon,
      chickenIcon,
      getPrice
    };
  }
};
</script>

<style scoped>
.icon-inline {
  height: 1em; /* Sets the icon height to match the font size of the text */
  vertical-align: middle; /* Aligns the icon with the middle of the text line */
}
</style>