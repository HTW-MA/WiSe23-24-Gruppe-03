<template>
  <input type="date" v-model="startDate" @change="fetchMenu" />
  <button class="htw-btn-active" @click="navigateToProfile">Einstellungen ändern</button>

  <div v-if="mensaSucks && !isWeekend">
    Tja... da musst du dich an deine Uni wenden. Wir haben keine Daten von deiner Mensa erhalten :(
  </div>

  <div v-else>
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
          <div>
            <div v-for="meal in categoryMeals" :key="meal.id">
              <img v-if="!isBadgePresent(meal.badges, 'Vegetarisch') && !isBadgePresent(meal.badges, 'Vegan')" :src="chickenIcon" alt="Fleischgericht" class="icon-inline">







              <div @click="openPopup(meal)">

                <img v-if="meal.additives.length > 0" :src="addOns" class="icon-inline" @click="openAdditivesPopup(meal)" >


                <div v-if="showAdditivesPopup" class="popup" @click="closePopupOnOverlayClick">
                  <div class="popup-content">
                    <h3>Zusatzstoffe</h3>
                    <ul>
                      <li v-for="additive in additivesList" :key="additive">{{ additive }}</li>
                    </ul>
                    <button @click="showAdditivesPopup = false" class="htw-btn-active">Schließen</button>
                  </div>
                </div>

                {{ meal.name || 'Unbekanntes Gericht' }} - Preis: {{ getPrice(meal) }}
                <button class="htw-btn-active" @click="selectMeal(meal)">Klick mich!</button>

                <div class="badge-container" v-if="meal.badges.length > 0">

                  <div v-for="badge in meal.badges" :key="badge.id">
                    <img :src="getBadgeSymbol(badge.name)" class="icon-inline" @click.stop="openBadgePopup(meal.id, badge)">


                    <div v-if="showBadgePopup === meal.id" class="popup" @click="closePopupOnOverlayClick">
                      <div class="popup-content">
                        <h4>{{currentBadge.name}}</h4>
                        <p>{{ currentBadge.description }}</p>
                        <button @click="closeBadgePopup" class="htw-btn-active">Schließen</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, watch, computed, onMounted, reactive} from 'vue';
import {useRouter} from "vue-router";
import axios from 'axios';
import veganIcon from '../assets/leafFull.png';
import veggieIcon from '../assets/veggie.png'
import chickenIcon from '../assets/fullChicken.png'
import addOns from '../assets/zusatzstoffe.png'
import gruen from '../assets/grueneAmpel.jpg'
import aggro from '../assets/aggriculture.png'
import co2 from '../assets/co2.jpg'
import fairtrade from '../assets/fairtrade.png'
import fish from '../assets/fish.png'
import gelb from '../assets/gelbeAMpel.png'
import rot from '../assets/roteAmpel.png'
import water from '../assets/water.png'
import klima from '../assets/klima.jpg'



import fav_db from "@/fav_db";
import {changeColorScheme} from "@/utils";
import store from "@/store";
import badges_db from "@/badges_db";



export default {
  name: 'MenuDisplay',
  props: {
    selectedCanteen: String,
    selectedRole: String,
    selectedDiet: String,
    loseWeight: String,
  },

  methods: {



    isBadgePresent(badges, badgeName) {
      return badges.some(badge => badge.name === badgeName);
    },

    openPopup(meal) {
      meal.showPopup = true;
    },


  },
  computed: {


    filteredMeals() {
      const filtered = {};
      for (const date in this.meals) {
        filtered[date] = {};
        for (const category in this.meals[date]) {
          if (this.loseWeight === 'tooFat' && category === 'Desserts') {
            continue;
          }
          filtered[date][category] = this.meals[date][category].filter(meal => {
            if (this.selectedDiet === 'Veganer') {
              return this.isBadgePresent(meal.badges, 'Vegan');
            } else if (this.selectedDiet === 'Vegetarier') {
              return this.isBadgePresent(meal.badges, 'Vegetarisch') || this.isBadgePresent(meal.badges, 'Vegan');
            }
            return true;
          });
        }
      }


      const sortedFiltered = {};
      for (const date in filtered) {
        if (filtered[date]['Essen']) {
          sortedFiltered[date] = { 'Essen': filtered[date]['Essen'] };
        } else {
          sortedFiltered[date] = {};
        }

        for (const category in filtered[date]) {
          if (category !== 'Essen') {
            sortedFiltered[date][category] = filtered[date][category];
          }
        }
      }

      return sortedFiltered;
    },

    mensaSucks() {
      const meal = this.meals[this.startDate];
      return meal && Object.keys(meal).length === 0;
    }},


  setup(props) {


    const showAdditivesPopup = ref(false);
    const additivesList = ref([]);

    const openAdditivesPopup = (meal) => {
      additivesList.value = meal.additives.map(additive => additive.text);
      showAdditivesPopup.value = true;
    };

    const closePopupOnOverlayClick = (event) => {

      if (!event.target.closest('.popup-content')) {
        showAdditivesPopup.value = false;
      }
    };




    const expandedCategories = reactive({
      Essen: true

    });



    const startDate = ref(sessionStorage.getItem('selectedDate') || new Date().toISOString().slice(0, 10));
    const meals = ref([]);
    const badges = ref([])

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
      return day === 0 || day === 6;
    });


    const router = useRouter();

    const navigateToProfile = () => {
      router.push('/Profile');
    };

    const fetchMenu = async () => {
      try {

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


    const getBadgeSymbol = (badgeName) => {
      const badgeSymbols = {
        "Grüner Ampelpunkt":gruen,
        "Gelber Ampelpunkt":gelb,
        "Roter Ampelpunkt":rot,
        "Vegan": veganIcon,
        "Fairtrade": fairtrade,
        "Klimaessen": klima,
        "Vegetarisch": veggieIcon,
        "Nachhaltige Landwirtschaft": aggro,
        "Nachhaltige Fischerei": fish,
        "CO2_bewertung_A": co2,
        "CO2_bewertung_B": co2,
        "CO2_bewertung_C": co2,
        "H2O_bewertung_A": water,
        "H2O_bewertung_B": water,
        "H2O_bewertung_C": water,
      };
      return badgeSymbols[badgeName] || "path/to/default-icon.png";
    };


    const fetchBadges = async () => {
      try {
        const response = await axios.get('https://mensa.gregorflachs.de/api/v1/badge', {
          headers: { 'X-API-KEY': process.env.VUE_APP_API_KEY }
        });
        await badges_db.badges.bulkPut(response.data);
        badges.value = response.data;
        console.log(badges.value)
      } catch (error) {
        console.error('Error fetching badges:', error);
      }
    };

    const showBadgePopup=ref(false);
    const currentBadge = ref({});
  const openBadgePopup = (mealId, badge) => {
      currentBadge.value = badge;
      showBadgePopup.value = mealId;
    };

    const closeBadgePopup = () => {
      showBadgePopup.value = null;
    };

    onMounted(async () => {
      try{
        await fetchMenu();
        checkAndCompareMeals();
        updateButtonColor();

        const storedBadges = await badges_db.badges.toArray();
        if (storedBadges.length > 0) {
          badges.value = storedBadges;
        } else {
          await fetchBadges();
        }

      }
      catch (exception){
        console.log(exception)

      }


    });



    const checkAndCompareMeals = () => {
      const today = new Date().toISOString().split('T')[0];
      const lastRunDate = localStorage.getItem('lastRunDate');

      if (today !== lastRunDate) {
        compareMealsWithDatabase();
        localStorage.setItem('lastRunDate', today);
      }
    };

    const compareMealsWithDatabase = async () => {
      try{
        let allMealIds = [];
        for (const date in meals.value) {
          for (const category in meals.value[date]) {
            allMealIds = allMealIds.concat(meals.value[date][category].map(meal => meal.id));
          }
        }

        const matchingMeals = await fav_db.meal.where('id').anyOf(allMealIds).toArray();

        if (matchingMeals.length > 0) {
          const mealNames = matchingMeals.map(meal => meal.name).join(', ');
          if (Notification.permission === "granted") {
            new Notification("Whoop! Whoop!", {
              body: `Es gibt dein(e) Lieblingsessen: ${mealNames}`,

            });
          }
        }

      }
      catch (error){
        console.log(error)

      }

    };

    const updateButtonColor = () => {
      changeColorScheme(store.state.selectedCanteen, 'backgroundColor', '.htw-btn-active');
    };
    watch(() => store.state.selectedCanteen, updateButtonColor);

    watch(() => props.selectedCanteen, fetchMenu);
    watch(startDate, (newValue) => {
      fetchMenu();
      sessionStorage.setItem('selectedDate', newValue);
    });


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
      chickenIcon,
      getPrice,
      isWeekend,
      navigateToProfile,
      selectedMeal,
      selectMeal,
      expandedCategories,
      addOns,
      showAdditivesPopup,
      additivesList,
      openAdditivesPopup,
      closePopupOnOverlayClick,
      klima,
      getBadgeSymbol,
      openBadgePopup,
      showBadgePopup,
      currentBadge,
      closeBadgePopup




    };
  }
};
</script>

<style scoped>
.icon-inline {
  height: 1em;
  vertical-align: middle;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}


.htw-btn-active {
  background-color: #76B900;
  color: white;
  margin-left: 10px;
}

.badge-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

</style>
