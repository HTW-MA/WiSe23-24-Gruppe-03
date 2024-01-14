<template>
  <div v-if="favorites.length > 0" class="container">
    <h2>Lieblingsessen</h2>
    <div v-for="meal in favorites" :key="meal.id" class="meal-item">
      <p class="meal-name">{{ meal.name }}</p>
      <div class="rating-symbols">
        <p>{{ mealRatings[meal.id] }}</p>
        <p>{{meal.id}}</p>
        <img v-for="symbol in getRatingSymbols(mealRatings[meal.id])" :src="symbol" :key="symbol" alt="Rating Symbol" class="rating-symbol">
      </div>
      <div class="button-container">
        <button @click="deleteMeal(meal.id)" class="delete-button">X</button>
        <button @click="prepareReview(meal)" class="htw-btn-active">Bewertung abgeben</button>
      </div>
      <div v-if="showReviewPopup" class="review-popup">
        <div class="popup-content">
          <h3>Bewertung abgeben</h3>

          <div class="star-rating" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
            <button @click="updateRating(-0.5)" class="rating-change-button">-</button>
            <span v-for="item in 5" :key="item" ref="stars" @click="handleClick($event, item)">
                          <img :src="getChickenImage(item)" alt="rating symbol" class="rating-symbol" />
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
    </div>
  </div>
</template>
<script>
import {ref, onMounted, reactive} from 'vue';
import axios from 'axios';
import fav_db from "@/fav_db";
import review_db from "@/review_db";

export default {
  name: 'FavoritesView',




  setup() {

    const favorites = ref([]);
    const mealRatings=reactive({})

    const deleteMeal = async (mealId) => {
      try {
        await fav_db.meal.delete(mealId);
        favorites.value = favorites.value.filter(meal => meal.id !== mealId);
      } catch (error) {
        console.error('Error deleting meal:', error);
      }
    };



    const selectedDiet = ref(localStorage.getItem('selectedDiet') || '');
    let filledSymbol;
    let emptySymbol;
    let halfSymbol;

    if (selectedDiet.value === "Allesfresser") {
      filledSymbol = require('@/assets/fullChicken.png');
      emptySymbol = require('@/assets/emptyChicken.png');
      halfSymbol = require('@/assets/halfChicken.png');
    } else {
      filledSymbol = require('@/assets/leafFull.png');
      emptySymbol = require('@/assets/leafEmpty.png');
      halfSymbol = require('@/assets/leafHalf.png');
    }

    async function getMyRating(meal) {
      if (!mealRatings[meal.id]) { // Check if rating is not already fetched
        const record = await review_db.reviews.where({ mealId: meal.id }).first();
        mealRatings[meal.id] = record ? record.rating : 0; // Update the mealRatings object
      }
    }

    const getRatingSymbols = (rating) => {
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
      return symbols;
    };

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
    };

    const handleTouchMove = (event) => {
      event.preventDefault();
      const touch = event.touches[0];
      updateRatingBasedOnTouch(touch);
      touchEndX = touch.screenX;
      touchEndY = touch.screenY;
    };

    const stars = ref([]);
    const updateRatingBasedOnTouch = (touch) => {
      const touchX = touch.clientX;
      stars.value.forEach((star, index) => {
        const { left, right } = star.getBoundingClientRect();
        const midPoint = left + (right - left) / 2;

        if (touchX >= left && touchX < midPoint) {
          setRating(index + 0.5);
        } else if (touchX >= midPoint && touchX <= right) {
          setRating(index + 1);
        }
      });
    };

    async function loadFavorites() {
      const meals = await fav_db.meal.toArray();
      if (meals.length > 0) {
        favorites.value = meals.map(meal => {
          meal.mealReviews = { averageRating: 0, comment: '' };
          return meal;
        });
        console.log(meals)
      }

      for (const meal of favorites.value) {
        try {
          const response = await axios.get(`https://mensa.gregorflachs.de/api/v1/meal?ID=${meal.id}&loadingtype=complete`, {
            headers: { 'X-API-KEY': process.env.VUE_APP_API_KEY }
          });
          meal.mealReviews.averageRating = response.data[0]?.mealReviews[0]?.averageRating;
          await getMyRating(meal)
        } catch (error) {
          console.error('Error fetching meal details:', error);
        }
      }
      favorites.value = [...favorites.value];
    }

    const currentMealForReview = ref(null);
    const prepareReview = (meal) => {
      console.log('prepare'+meal.id)
      currentMealForReview.value = meal;
      showReviewPopup.value = true;
    };

    const starRating = ref(0);

    const handleClick = (event, item) => {
      const starElement = event.currentTarget;
      const { left, width } = starElement.getBoundingClientRect();
      const clickX = event.clientX;
      const midPoint = left + width / 2;

      if (clickX < midPoint) {
        setRating(item - 0.5);
      } else {
        setRating(item);
      }
    };

    const setRating = (newRating, isHalf = false) => {
      starRating.value = isHalf ? newRating - 0.5 : newRating;
    };

    const getChickenImage = (item) => {
      const image = starRating.value >= item
          ? filledSymbol
          : starRating.value >= item - 0.5
              ? halfSymbol
              : emptySymbol;
      return image;
    };

    const showReviewPopup = ref(false);
    const reviewComment = ref('');
    const reviewRating = ref(0);

    const submitReview = () => {
      const meal = currentMealForReview.value;
      if (!meal) {
        console.error("No meal selected for review");
        return;
      }

      console.log("Submitting review for meal:", meal.id);
      console.log('he' +meal.id)
      if (starRating.value && reviewComment.value) {


        postMealReview(meal.id, starRating.value, reviewComment.value, meal.category);
        showReviewPopup.value = false;
        reviewComment.value = '';
        starRating.value = 0;
      } else {
        alert('Bitte geben Sie eine Bewertung und einen Kommentar ein.');
      }
      currentMealForReview.value = null;
      loadFavorites();
    };

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

          console.log('rating' +rating)
          try{
            const response =await axios.put('https://mensa.gregorflachs.de/api/v1/mealreview', review, config);
            console.log(response.data)
            if (response && response.data) {
              console.log('ich'+mealID)
              console.log(response.data.id)
              await review_db.reviews.put({
                mealId: mealID,
                userId: response.data.userId,
                apiResponseId: response.data.id,
                rating:rating
              });
              mealRatings[mealID] = rating;
            }
          }
          catch (error){
            console.log('Fehler :', error)
          }
        }
        else{
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
          try{
            const response = await axios.post('https://mensa.gregorflachs.de/api/v1/mealreview', review, config);
            console.log(response.data);
            if (response && response.data) {
              console.log('ich'+mealID)
              console.log(response.data.id)
              await review_db.reviews.add({
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



      } catch (error) {
        console.error('Fehler beim Posten:', error)

      }



    }


    const updateRating = (change) => {
      starRating.value = Math.max(0, Math.min(5, starRating.value + change));
    };

    onMounted(loadFavorites);

    return {
      favorites,
      deleteMeal,
      getRatingSymbols,
      filledSymbol,
      halfSymbol,
      emptySymbol,
      prepareReview,
      handleClick,
      getChickenImage,
      reviewRating,
      submitReview,
      showReviewPopup,
      updateRating,
      handleTouchStart,
      handleTouchEnd,
      handleTouchMove,
      touchEndX,
      touchEndY,
      touchStartX,
      touchStartY,
      reviewComment,
      stars,
      getMyRating,
      mealRatings
    };
  }
};
</script>
<style>



.container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.meal-item {

  background-color: #f5f5f5;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align:  left;
  width:85vw;

}

.meal-name {
  margin-bottom: 0.5em;
  font-size: 16px;
}

.rating-symbols {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;

}

.rating-symbol {
  margin-right: 0.3em;
  width: 2.4em;
  height: auto;

}

.delete-button {
  color: red;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.8em;
  font-weight: bold;
}

.meal-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.category-section {
  background-color: #f5f5f5;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align:  left;
}

.button-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
  align-items: center;

}


.htw-btn-active {
  background-color: #76B900;
  color: white;
  margin-left: 10px;
}
</style>