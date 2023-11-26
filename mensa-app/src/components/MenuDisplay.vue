<template>
  <input type="date" v-model="startDate" @change="fetchMenu" />
  <button class="btn-active" @click="navigateToProfile">Einstellungen ändern</button>
  <div v-if="isWeekend">
    Am Wochenende hat die Mensa zu - Geh nach Hause, kleiner Streber!
  </div>

  <div v-else-if="Object.keys(meals).length === 0 && !isWeekend">
    <p>Hm....da finden wir irgendwie nichts zu essen. Vielleicht bist du zu zeitig oder zu spät? Vielleicht will dir dein Handy auch sagen, dass du abnehmen sollst?</p>
  </div>

  <div v-else>
    <div v-for="(categories, date) in filteredMeals" :key="date">
      <h3>{{ date }}</h3>
      <div v-for="(categoryMeals, category) in categories" :key="category">
        <h4>{{ category }}</h4>
        <div v-for="meal in categoryMeals" :key="meal.id" >
          <p>

            <img v-if="isBadgePresent(meal.badges, 'Vegan')" :src="veganIcon" alt="Vegan" class="icon-inline">
            <img v-if="isBadgePresent(meal.badges, 'Vegetarisch')" :src="annaIcon" alt="Vegetarisch" class="icon-inline">
            <img v-if="!isBadgePresent(meal.badges, 'Vegetarisch') && !isBadgePresent(meal.badges, 'Vegan')" :src="chickenIcon" alt="Fleischgericht" class="icon-inline">
            {{ meal.name || 'Unbekanntes Gericht' }} - Preis: {{ getPrice(meal) }}
            <button class="btn-active" @click="selectMeal(meal)">Klick mich!</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, watch, computed, onMounted} from 'vue';
import {useRouter} from "vue-router";
import axios from 'axios';
import veganIcon from '../assets/vegan.png';
import veggieIcon from '../assets/veggie.png'
import chickenIcon from '../assets/chicken.png'
import annaIcon from '../assets/annalena.png'



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
    shouldDisplayMeal(meal) {
      if (this.selectedDiet === 'Veganer') {
        return this.isBadgePresent(meal.badges, 'Vegan');
      }
      return true;
    }


  },
  computed: {
    filteredMeals() {
      const filtered = {};
      for (const date in this.meals) {
        filtered[date] = {};
        for (const category in this.meals[date]) {
          filtered[date][category] = this.meals[date][category].filter(meal => {
            if (this.selectedDiet === 'Veganer') {
              return this.isBadgePresent(meal.badges, 'Vegan');
            } else if (this.selectedDiet === 'Vegetarier') {
              return this.isBadgePresent(meal.badges, 'Vegetarisch') || this.isBadgePresent(meal.badges, 'Vegan');
            }
            return true; //sonst alle essen zurück
          });
        }
      }
      return filtered;
    }
  },
  setup(props) {

    const startDate = ref(sessionStorage.getItem('selectedDate') || new Date().toISOString().slice(0, 10));
    const meals = ref([]);
    const storedMeals =sessionStorage.getItem('meals');
    const selectedMeal = ref(null);

    const selectMeal = (meal) => {
      selectedMeal.value = meal;
      router.push({ path:'/Meal', query: { mealId: meal.id } });
    };
    if (storedMeals){
      meals.value=JSON.parse(storedMeals)
    }

    const isWeekend = computed(() => {
      const day = new Date(startDate.value).getDay();
      return day === 0 || day === 6; // 0 for Sunday, 6 for Saturday
    });
    //falls doch noch benötigt:
    //const endDate = ref(new Date().toISOString().slice(0, 10));

    const router = useRouter();

    const navigateToProfile = () => {
      router.push('/Profile');
    };

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
        sessionStorage.setItem('meals', JSON.stringify(meals.value))
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(fetchMenu)


    watch(() => props.selectedCanteen, fetchMenu);
    watch(startDate, (newValue) => {
      fetchMenu();
      sessionStorage.setItem('selectedDate', newValue); // Save the new date to sessionStorage
    });

    //watch(endDate, fetchMenu);

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
      if (Array.isArray(meal.prices) && meal.prices.length > 0) {
        const priceObj = meal.prices.find(price => price.priceType === props.selectedRole);
        return priceObj ? priceObj.price : 'Der Betreiber hat leider keinen Preis angegeben :(';
      } else {
        return 'Preisinformation nicht verfügbar';
      }
    };

    return {

      startDate,
      categorizedMeals,
      meals,
      veganIcon,
      veggieIcon,
      annaIcon,
      chickenIcon,
      getPrice,
      isWeekend,
      navigateToProfile,
      selectedMeal,
      selectMeal
    };
  }
};
</script>

<style scoped>
.icon-inline {
  height: 1em;
  vertical-align: middle;
}

.btn-active {
  background-color: #76B900; /* Ist das HTW grün... */
  color: white;
  margin-left: 10px;
}
</style>

