<template>
  <div v-if="favorites.length > 0" class="container">
    <p></p>
    <p></p>
    <p></p>
    <h2>Lieblingsessen</h2>
    <div v-for="meal in favorites" :key="meal.id" class="meal-item"  >
      <p class="meal-name">{{ meal.name }}</p>
      <div class="rating-symbols">
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
            <button @click="updateRating(-0.5)" class="small-button" >-</button>
            <span v-for="item in 5" :key="item" ref="stars" @click="handleClick($event, item)">
                          <img :src="getChickenImage(item)" alt="small-image" class="rating-symbol" />
                      </span>
            <button @click="updateRating(0.5)" class="small-button">+</button>
          </div>
          <textarea class="comment-field"
                    v-model="reviewComment"
                    placeholder="Kommentar"
          ></textarea>
          <div class="button-container">
          <button @click="showReviewPopup = false;starRating = 0;" class="htw-btn-active">
            Abbrechen
          </button>
          <button @click="() =>submitReview()" class="htw-btn-active">
            Senden
          </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {ref, onMounted, reactive, watch, nextTick} from 'vue';
import axios from 'axios';
import fav_db from "@/fav_db";
import review_db from "@/review_db";
import {changeColorScheme} from "@/utils";
import store from "@/store";
import chickenIcon from "@/assets/fullChicken.png";
import emptyChicken from "@/assets/emptyChicken.png";
import halfChicken from "@/assets/halfChicken.png";
import leafIcon from "@/assets/leafFull.png";
import emptyLeaf from "@/assets/leafEmpty.png";
import halfLeaf from "@/assets/leafHalf.png";
import router from "../../router";

export default {
  name: 'FavoritesView',




  setup() {

    const navigateToProfile = () => {
      router.push('/Profile');
    };
    onMounted(() => {
      if ( localStorage.getItem('selectedCanteen') === null) {
        navigateToProfile(); // Or any other route
      }
    });

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
      filledSymbol = chickenIcon;
      emptySymbol = emptyChicken;
      halfSymbol = halfChicken;
    } else {
      filledSymbol = leafIcon;
      emptySymbol = emptyLeaf;
      halfSymbol = halfLeaf;
    }




    async function getMyRating(meal) {
      if (!mealRatings[meal.id]) {
        const record = await review_db.reviews.where({ mealId: meal.id }).first();
        mealRatings[meal.id] = record ? record.rating : 0;

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
      console.log("loadFavorites started")
      const meals = await fav_db.meal.toArray();
      console.log("Meals:" + meals)
      if (meals.length > 0) {
        favorites.value = meals.map(meal => {
          meal.mealReviews = { averageRating: 0, comment: '' };
          console.log("Meal:" + meal)
          console.log(meal.id)
          console.log(meal.name)
          console.log(meal.mealReviews)
          return meal;
        });

      }

      for (const meal of favorites.value) {
        try {
          const response = await axios.get(`https://mensa.gregorflachs.de/api/v1/meal?ID=${meal.id}&loadingtype=complete`, {
            headers: { 'X-API-KEY': process.env.VUE_APP_API_KEY }
          });
          console.log(response)
          meal.mealReviews.averageRating = response.data[0]?.mealReviews[0]?.averageRating;
          await getMyRating(meal)
          console.log(meal.mealRatings)

        } catch (error) {
          console.error('Error fetching meal details:', error);
        }
      }
      favorites.value = [...favorites.value];
      console.log("loadFavorites finished")
    }

    const currentMealForReview = ref(null);
    const prepareReview = (meal) => {

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

    const updateButtonColor = () => {
      changeColorScheme(store.state.selectedCanteen, 'backgroundColor', '.htw-btn-active');
    };

    const updateButtonColorPopup = () => {
      changeColorScheme(store.state.selectedCanteen, 'backgroundColor', '.htw-btn-active');
    };



    watch(showReviewPopup, async (newVal) => {
      if (newVal) {
        await nextTick();
        updateButtonColor();
      }
    });
    watch([() => store.state.selectedCanteen, () => showReviewPopup.value], (newValues, oldValues) => {
      if (newValues[0] !== oldValues[0] || (newValues[1] && !oldValues[1])) {
        updateButtonColorPopup();
      }
    });
    const submitReview = () => {
      const meal = currentMealForReview.value;
      if (!meal) {
        console.error("No meal selected for review");
        return;
      }
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
      const apiKey = process.env.VUE_APP_API_KEY;


      const headers = new Headers({
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      });


      try {
        const record = await review_db.reviews.where({ mealId: mealID }).first();
        if (record !== undefined) {
          const review = {
            id: record.apiResponseId,
            mealId: record.apiResponseId,
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
            const response = await fetch('https://mensa.gregorflachs.de/api/v1/mealreview', {
              method: 'PUT',
              headers: headers,
              body: JSON.stringify(review)
            });


            if (response.ok) {
              const data = await response.json();
              await review_db.reviews.put({
                mealId: mealID,
                userId: data.userId,
                apiResponseId: data.id,
                rating: rating
              });
              mealRatings[mealID] = rating;
            }
          } catch (error) {
            console.error('Fehler:', error);
          }
        } else {
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
            const response = await fetch('https://mensa.gregorflachs.de/api/v1/mealreview', {
              method: 'POST',
              headers: headers,
              body: JSON.stringify(review)
            });


            if (response.ok) {
              const data = await response.json();
              await review_db.reviews.add({
                mealId: mealID,
                userId: data.userId,
                apiResponseId: data.id,
                rating: rating
              });
            }
          } catch (error) {
            console.error('Fehler:', error);
          }
        }
      } catch (error) {
        console.error('Fehler beim Posten:', error);
      }
    }



    const updateRating = (change) => {
      starRating.value = Math.max(0, Math.min(5, starRating.value + change));
    };

    onMounted(async () => {
      await loadFavorites();

      nextTick(() => {
        updateButtonColor();
      });
      updateButtonColorPopup();
    });

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
      mealRatings,
      updateButtonColor,
      halfLeaf,
      halfChicken,
      chickenIcon,
      leafIcon,
      emptyLeaf,
      emptyChicken,
      starRating
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

.star-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0px;
}

.rating-symbols {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;

}

.rating-symbol {
  margin-right: 0.3em;
  width: 2em;
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



.comment-field {
  width: 100%;
  max-width: 100%;

}


.htw-btn-active {

}


.review-popup {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.18);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f5f5f5;
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


.review-popup .button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.review-popup .button-container > .htw-btn-active {
  flex: 0 0 auto;
  width: 100%;
  margin: 5px 0;
  text-align: center;
}
.container > .meal-item:first-child {
  margin-top: 400px;
}

</style>
