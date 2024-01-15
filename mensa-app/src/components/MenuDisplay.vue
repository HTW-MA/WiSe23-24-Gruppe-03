<template>

  <div id="app" @touchstart="handleTouchStart" @touchend="handleTouchEnd">


    <div class="content">
      <div class="date-picker">
        <span class="arrow" @click="decrementDate()">&#9664;</span>
        <input type="date" v-model="startDate" @change="fetchMenu" />
        <span class="arrow" @click="incrementDate()">&#9654;</span>
      </div>


      <button class="htw-btn-active" @click="navigateToProfile">
        Einstellungen ändern
      </button>
      <div v-if="mensaSucks && !isWeekend">
        Tja... da musst du dich an deine Uni wenden. Wir haben keine Daten von deiner Mensa erhalten :(
      </div>

      <div v-else>
        <div v-if="isWeekend">
          Am Wochenende hat die Mensa zu - Geh nach Hause, kleiner Streber!
        </div>

        <div v-else-if="Object.keys(meals).length === 0 && !isWeekend">
          <p>
            Hm....da finden wir irgendwie nichts zu essen. Vielleicht bist du zu zeitig oder zu spät?
            Vielleicht will dir dein Handy auch sagen, dass du abnehmen sollst?
          </p>
        </div>

        <div v-else>
          <div v-for="(categories, date) in filteredMeals" :key="date">
            <h3></h3>

            <div v-for="(categoryMeals, category) in categories" :key="category"  class="category-section">
              <h4>{{ category }}</h4>
              <div>
                <div v-for="meal in categoryMeals" :key="meal.id" class="meal-container">


                  <div
                      v-if="showMessage"
                      :style="{ top: popupPosition.y + 'px', left: popupPosition.x + 'px' }"
                      class="favorite-popup"
                  >
                    {{ message }}
                  </div>


                  <div @click="openPopup(meal)">



                    <div
                        v-if="showAdditivesPopup"
                        class="popup"
                    >
                      <div class="popup-content">
                        <h3>Zusatzstoffe</h3>
                        <ul>
                          <li v-for="additive in additivesList" :key="additive">
                            {{ additive }}
                          </li>
                        </ul>
                        <button @click="showAdditivesPopup = false" class="htw-btn-active">
                          Schließen
                        </button>
                      </div>
                    </div>


                    {{ meal.name || 'Unbekanntes Gericht' }}

                    <span class="meal-price">{{ getPrice(meal) }} €</span>





                    <div v-if="showReviewPopup" class="review-popup">
                      <div class="popup-content">
                        <h3>Bewertung abgeben</h3>

                        <div class="star-rating" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
                          <button @click="updateRating(-0.5)" class="rating-change-button">-</button>
                          <span v-for="item in 5" :key="item" ref="stars" @click="handleClick($event, item)">
                          <img :src="getChickenImage(item)" alt="rating symbol" class="small-image" />
                      </span>
                          <button @click="updateRating(0.5)" class="rating-change-button">+</button>
                        </div>


                        <textarea
                            v-model="reviewComment"
                            placeholder="Kommentar"
                        ></textarea>

                        <button @click="() =>submitReview()" class="htw-btn-active">
                          Senden
                        </button>

                        <button @click="showReviewPopup = false" class="htw-btn-active">
                          Abbrechen
                        </button>

                      </div>

                    </div>
                    <div class="flex-container">
                      <div class="badge-container" v-if="meal.badges.length > 0">
                        <div class="break-row"></div>
                        <div v-for="badge in meal.badges" :key="badge.id" class="badge-container">


                          <img
                              :src="getBadgeSymbol(badge.name)"
                              class="icon-inline"
                              @click.stop="openBadgePopup(meal.id, badge, $event)"
                              @touchstart.stop="openBadgePopup(meal.id, badge, $event)"

                          >


                          <div
                              v-if="showBadgePopup === meal.id"
                              class="popup"
                          >
                            <div class="popup-content" ref="popupContentRef">
                              <h4>{{ currentBadge.name }}</h4>
                              <p class="current-badge">{{ currentBadge.description }}</p>
                              <button @click="closeBadgePopup" class="htw-btn-active">
                                Schließen
                              </button>
                            </div>
                          </div>
                        </div>

                        <img
                            v-if="meal.additives.length > 0"
                            :src="addOns"
                            class="icon-inline"
                            @click.stop="openAdditivesPopup(meal, $event)"
                            @touchstart.stop="openAdditivesPopup(meal, $event)"
                        >

                        <div class="break-row"></div>

                        <img
                            v-if="category === 'Essen' || category === 'Desserts'"
                            :src="isFavorite(meal) ? fullStar : emptyStar"
                            alt="Star"
                            class="icon-inline"
                            @click="toggleFavorite(meal); openFavPopup(meal, $event)"
                        >

                        <button @click="prepareReview(meal)" class="htw-btn-active">Bewerten</button>


                      </div>




                      <div v-if="showMeatPopup" class="meat-popup">
                        <div class="popup-content">
                          <h3>GERICHT ENTHÄLT FLEISCH</h3>
                          <img :src="noice" alt="" />
                          <button @click="showMeatPopup = false" class="htw-btn-active">Schließen</button>
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
import fullStar from '../assets/fullStar.png'
import emptyStar from '../assets/emptyStar.png'
import left from '../assets/leftArrow.png'
import right from '../assets/rightArrow.png'
import noice from '../assets/noice.webp'

import fav_db from "@/fav_db";
import {changeColorScheme} from "@/utils";
import store from "@/store";
import badges_db from "@/badges_db";
import review_db from "@/review_db";



export default {
  name: 'MenuDisplay',
  props: {
    selectedCanteen: String,
    selectedRole: String,
    selectedDiet: String,
    loseWeight: String,
  },




  methods: {



    showChickenIcon(badges) {
      return !badges.some(badge => badge.name === 'Vegetarisch' || badge.name === 'Vegan');
    },






    isBadgePresent(badges, badgeName) {
      return badges.some(badge => badge.name === badgeName);
    },

    openPopup(meal) {
      meal.showPopup = true;
    },



  },
  computed: {

    store() {
      return store
    },




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



    const currentMealForReview = ref(null);

    function prepareReview(meal) {
      currentMealForReview.value = meal;
      showReviewPopup.value = true;
    }


    const showReviewPopup = ref(false);
    const reviewComment = ref('');
    const reviewRating = ref(0);

    const popupPosition  =ref({x:0,y:0});

    const showMessage = ref(false);
    const message = ref('');
    const popupContentRef = ref(null)

    const showFavoritePopup = ref(false);
    const starRating = ref(0);
    let filledSymbol;
    let emptySymbol;
    let halfSymbol;
    const selectedDiet = ref(localStorage.getItem('selectedDiet'));


    if (selectedDiet.value === "Allesfresser") {
      filledSymbol = require('@/assets/fullChicken.png');
      emptySymbol = require('@/assets/emptyChicken.png');
      halfSymbol = require('@/assets/halfChicken.png')
    } else {
      filledSymbol = require('@/assets/leafFull.png');
      emptySymbol = require('@/assets/leafEmpty.png');
      halfSymbol = require('@/assets/leafHalf.png');
    }

    function handleClick(event, item) {
      const starElement = event.currentTarget;
      const { left, width } = starElement.getBoundingClientRect();
      const clickX = event.clientX;
      const midPoint = left + width / 2;

      if (clickX < midPoint) {
        setRating(item - 0.5);
      } else {
        setRating(item);
      }
    }
    function setRating(newRating, isHalf = false) {
      starRating.value = isHalf ? newRating - 0.5 : newRating;
    }
    function getChickenImage(item) {
      const image = starRating.value >= item
          ? filledSymbol
          : starRating.value >= item - 0.5
              ? halfSymbol
              : emptySymbol;
      return image;
    }

    function submitReview() {
      const meal = currentMealForReview.value;
      if (!meal) {
        console.error("No meal selected for review");
        return;
      }
      if (starRating.value&& reviewComment.value) {


        postMealReview(meal.id, starRating.value, reviewComment.value, meal.category);
        showReviewPopup.value = false;
        reviewComment.value = '';
        starRating.value = 0;
      } else {
        alert('Bitte geben Sie eine Bewertung und einen Kommentar ein.');
      }
      currentMealForReview.value = null;
    }



    async function postMealReview(mealID, rating, comment, category) {
      const userID = localStorage.getItem('userID');

      const config = {
        headers: {
          'X-API-KEY': process.env.VUE_APP_API_KEY
        }
      };



      try {
        const record = await review_db.reviews.where({ mealId: mealID }).first();
        if (record !== undefined){
          const review = {
            id: record.apiResponseId,
            mealId: record.apiResponseId,
            userId:userID,
            detailRatings: [
              {
                rating: rating,
                name: category
              }
            ],
            comment: comment

          }

          try{
            const response =await axios.put('https://mensa.gregorflachs.de/api/v1/mealreview', review, config);
            if (response && response.data) {
              await review_db.reviews.put({
                mealId: mealID,
                userId: response.data.userId,
                apiResponseId: response.data.id,
                rating:rating
              });

            }
          }
          catch (error){
            console.log('Fehler :', error)
          }
        }
        else {
          const review = {
            mealId: mealID,
            userId: userID,
            detailRatings: [
              {
                rating: rating,
                name: category
              }
            ],
            comment: comment
          };
          try {
            const response = await axios.post('https://mensa.gregorflachs.de/api/v1/mealreview', review, config);
            if (response && response.data) {
              await review_db.reviews.add({
                mealId: mealID,
                userId: response.data.userId,
                apiResponseId: response.data.id,
                rating: rating
              });
            }

          } catch (error) {
            console.log('Fehler :', error)
          }

        }
      } catch (error) {
        console.error('Fehler beim Posten:', error)
      }
    }



    function generateTimestampedHex(len) {
      const timestampHex = Date.now().toString(16);

      const remainingLen = len - timestampHex.length;

      let randomHex = '';
      const characters = '0123456789abcdef';
      for (let i = 0; i < remainingLen; i++) {
        randomHex += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return timestampHex + randomHex;
    }

    const isFavorite = (meal) => {
      return favoriteStatuses.value[meal.id];
    };


    const toggleFavorite = async (meal) => {
      if (isFavorite(meal)) {
        await fav_db.meal.delete(meal.id);
        favoriteStatuses.value[meal.id] = false;
        message.value = 'gelöscht';
      } else {
        await fav_db.meal.add({
          id: meal.id,
          name: meal.name,
          mealReviews: {
            averageRating: meal.mealReviews?.averageRating,
            comment: meal.mealReviews?.comment
          },
          category: meal.category
        });
        favoriteStatuses.value[meal.id] = true;
        message.value = 'zu Favoriten hinzugefügt';
      }

    };



    const meals = ref([]);

    const favoriteStatuses = ref({});

    const updateFavoriteStatuses = async () => {
      for (let date in meals.value) {
        for (let category in meals.value[date]) {
          for (let meal of meals.value[date][category]) {
            const res = await fav_db.meal.get(meal.id);
            favoriteStatuses.value[meal.id] = !!res;
          }
        }
      }
    };

    watch(meals, updateFavoriteStatuses, { deep: true });


    const showAdditivesPopup = ref(false);
    const additivesList = ref([]);

    const openFavPopup=(meal, event) =>{
      showAdditivesPopup.value = false;
      showBadgePopup.value = false;
      event.stopPropagation();
      let x,y;
      if (event.type.startsWith('touch')){
        const touch = event.touches[0] || event.changedTouches[0];
        x=touch.clientX;
        y=touch.clientY;
      }
      else {
        x=event.clientX;
        y=event.clientY;
      }
      showMessage.value = true;
      popupPosition.value = {x,y}

      setTimeout(() => {
        showMessage.value = false;
      }, 900);
    }

    const openAdditivesPopup = (meal,event) => {
      showMessage.value = false;
      showFavoritePopup.value = false;
      showBadgePopup.value = false;
      event.stopPropagation();
      let x,y;
      if (event.type.startsWith('touch')){
        const touch = event.touches[0] || event.changedTouches[0];
        x=touch.clientX;
        y=touch.clientY;
      }
      else {
        x=event.clientX;
        y=event.clientY;
      }


      additivesList.value = meal.additives.map(additive => additive.text);
      popupPosition.value = {x,y}
      showAdditivesPopup.value = true;
    };






    const expandedCategories = reactive({
      Essen: true

    });



    const startDate = ref(sessionStorage.getItem('selectedDate') || new Date().toISOString().slice(0, 10));
    const isTouchDevice = ref('ontouchstart' in window || navigator.maxTouchPoints > 0);


    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const stars=ref([])

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleGesture();
    };

    const updateRating = (change) => {
      starRating.value = Math.max(0, Math.min(5, starRating.value + change));
    };
    const handleTouchMove = (event) => {
      event.preventDefault();


      const touch = event.touches[0];
      updateRatingBasedOnTouch(touch);
      touchEndX = touch.screenX;
      touchEndY = touch.screenY;
    };

    const updateRatingBasedOnTouch = (touch) => {
      const touchX = touch.clientX;
      stars.value.forEach((star, index) => {
        const { left, right } = star.getBoundingClientRect();
        const midPoint = left + (right - left) / 2; // Calculate the midpoint of the star

        if (touchX >= left && touchX < midPoint) {
          setRating(index + 0.5); // Set a half star rating if touch is in the first half
        } else if (touchX >= midPoint && touchX <= right) {
          setRating(index + 1); // Set a full star rating if touch is in the second half
        }
      });
    };

    const handleGesture = () => {
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      //diesen Wert ggf. erhöhen, falls swipe immer noch zu sensibel
      const threshold = window.innerWidth / 2;

      if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) incrementDate();
        else decrementDate();
      }
    };

    const incrementDate = () => {
      let date = new Date(startDate.value);
      date.setDate(date.getDate() + 1);
      startDate.value = date.toISOString().slice(0, 10);
      fetchMenu();
      navigator.vibrate(200);
    };

    const decrementDate = () => {
      let date = new Date(startDate.value);
      date.setDate(date.getDate() - 1);
      startDate.value = date.toISOString().slice(0, 10);
      fetchMenu();
      navigator.vibrate(200);
    };

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
      } catch (error) {
        console.error('Error fetching badges:', error);
      }
    };



    const showBadgePopup=ref(false);
    const currentBadge = ref({});
    const showMeatPopup = ref(false)

    const openMeatPopup =(event)=>{
      event.stopPropagation();

      let x, y;
      if (event.type.startsWith('touch')) {
        const touch = event.touches[0] || event.changedTouches[0];
        x = touch.clientX;
        y = touch.clientY;
      } else {
        x = event.clientX;
        y = event.clientY;
      }
      popupPosition.value = { x, y };
      showMeatPopup.value=true
    }
    const openBadgePopup = (mealId, badge,event) => {
      showMessage.value = false;
      showAdditivesPopup.value = false;
      event.stopPropagation();
      let x,y;
      if (event.type.startsWith('touch')){
        const touch = event.touches[0] || event.changedTouches[0];
        x=touch.clientX;
        y=touch.clientY;
      }
      else {
        x=event.clientX;
        y=event.clientY;
      }

      currentBadge.value = badge;
      showBadgePopup.value = mealId;
      popupPosition.value = {x,y};

      if (popupContentRef.value) {
        popupContentRef.value.scrollTop =-20;
      }
    };

    const closeBadgePopup = () => {
      showBadgePopup.value = null;
    };



    onMounted(



        async () => {

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

        },

    );



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
        return '?';
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
      popupContentRef,
      klima,
      getBadgeSymbol,
      openBadgePopup,
      showBadgePopup,
      currentBadge,
      closeBadgePopup,
      popupPosition,
      isFavorite,
      fullStar,
      emptyStar,
      toggleFavorite,
      showMessage,
      message,
      openFavPopup,
      generateTimestampedHex,
      submitReview,
      setRating,
      reviewRating,
      getChickenImage,
      reviewComment,
      showReviewPopup,
      showFavoritePopup,
      left,
      right,
      incrementDate,
      decrementDate,
      handleTouchEnd,
      handleTouchStart,
      isTouchDevice,
      prepareReview,
      handleTouchMove,
      stars,
      handleClick,
      showMeatPopup,
      openMeatPopup,
      noice,
      starRating,
      updateRating

    };
  }
};
</script>

<style scoped>


#app {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  margin-top: 0;
  padding-top: 10vh;
}


.content {
  width: 80%;

}
.icon-inline {
  height: 1.7em;
  vertical-align: middle;
  margin-right: 10px;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 100;

  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0), 0 4px 8px rgba(0, 0, 0, 0);
  word-wrap: break-word;
  font-size: 18px;
  padding: 20px;
  line-height: 1.5;
  max-width: 90vw;
  max-height: 80vh;
  overflow: auto;
}


.review-popup {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.18);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  z-index: 1000;
  overflow: auto;
  word-wrap: break-word;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  opacity: 1;
  max-width: 80vw;
  max-height: 80vh;
  display: inline-block;

}




.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  display: inline-block;
  word-wrap: break-word;
  width: 100%;
  height: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.18);
  overflow-y: scroll;
}


.htw-btn-active {
  background-color: #76B900;
  color: white;
  margin-left: 10px;
}







.favorite-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.18);
  z-index: 1000;
  max-width: 80%;
  display: inline-block;
  word-wrap: break-word;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  opacity: 1;

}



.arrow {
  cursor: pointer;
  font-size: 1vw;

}

.date-picker {
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow {
  cursor: pointer;
  margin: 0 10px;
  font-size: 20px;
}

.meat-popup {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0), 0 4px 8px rgba(0, 0, 0, 0);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  z-index: 1000;
  overflow: auto;
  word-wrap: break-word;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  opacity: 1;
  max-width: 80vw;
  max-height: 80vh;
  display: inline-block;
}

.category-section {
  background-color: #f5f5f5;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align:  left;

}

.category-section h4 {
  margin-top: 0;
  text-align: left;
  font-weight: bold;
}

.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  align-items: center;

}

.badge-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-size: 16px;
}




.meal-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 15px;
}



.meal-container:last-child {
  padding-bottom: 40px;
}

.meal-price {
  flex-shrink: 0;
  font-weight: bold;
  text-align: right;
  white-space: nowrap;
}

.break-row {
  width: 100%;
}
.current-badge{

  font-size: 16px;
}
</style>
