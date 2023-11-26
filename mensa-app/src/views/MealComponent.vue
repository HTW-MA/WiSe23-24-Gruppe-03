<template>
  <div v-if="mealDetails">
    <h2>{{ mealDetails.name }}</h2>
    <p>Kategorie: {{ mealDetails.category }}</p>
    <p>Kosten für dich:  {{ displayPrice }} €</p>

    <div v-if="filteredBadges && filteredBadges.length">
      <h3>Badges:</h3>
      <ul>
        <li v-for="badge in filteredBadges" :key="badge.id">
          <strong>{{ badge.name }}</strong>: {{ badge.description }}
        </li>
      </ul>
    </div>
    <button class="btn-active" @click="showReviewPopup = true">Bewertung abgeben</button>
    <div v-if="showReviewPopup" class="review-popup">
      <div class="popup-content">
        <h3>Bewertung abgeben</h3>
        <input type="number" v-model="reviewRating" min="1" max="5" placeholder="Bewertung (1-5)" />
        <textarea v-model="reviewComment" placeholder="Kommentar"></textarea>
        <button class="btn-active" @click="submitReview" >Senden</button>
        <button class="btn-active" @click="showReviewPopup = false">Abbrechen</button>
      </div>
    </div>
    <p></p>
    <button class="btn-active" @click="addToFavorites">Zu Lieblingsessen hinzufügen</button>

  </div>
  <div v-else>
    Suche...
  </div>
</template>

<script>
import {useRoute} from "vue-router";
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import fav_db from "@/fav_db";

export default {
  name: 'MealComponent',
  props: {
    meal: Object,

  },

  setup() {

    const starRating = ref(0);
    function setRating(newRating) {
      starRating.value = newRating;
    }

    function submitReview() {
      if (reviewRating.value && reviewComment.value) {
        console.log(mealDetails.value.id, reviewRating.value, reviewComment.value)
        postMealReview(mealDetails.value.id, reviewRating.value, reviewComment.value);
        showReviewPopup.value = false;
        reviewComment.value = '';
        reviewRating.value = 0;
      } else {
        alert('Bitte geben Sie eine Bewertung und einen Kommentar ein.');
      }
    }

    async function postMealReview(mealID, rating, comment) {
      // Assuming you have a function to get or generate the userID
      const userID = localStorage.getItem('userID') // Replace with your method to obtain/generate userID

      const config = {
        headers: {
          'X-API-KEY': process.env.VUE_APP_API_KEY
        }
      };

      const review = {
        ID: generateTimestampedHex(24), // Generates a unique ID for the review
        mealID: mealID,
        userID: userID,
        detailRatings: [
          {
            rating: rating,
            name: "Essen"
          }
        ],
        comment: comment
      };

      try {
        const response = await axios.post('https://mensa.gregorflachs.de/api/v1/mealreview', review, config);
        console.log(response.data);
        // Handle success
      } catch (error) {
        console.error('Error posting meal review:', error);
        // Handle error
      }
    }

    const showReviewPopup = ref(false); // Controls the visibility of the review popup
    const reviewComment = ref(''); // Stores the user's comment
    const reviewRating = ref(0);


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


    const route = useRoute();
    const mealId = ref(route.query.mealId);

    const mealDetails = ref(null); // To store the fetched meal details
    const selectedRole = ref(localStorage.getItem('selectedRole') || 'defaultRole');

    const displayPrice = computed(() => {
      if (mealDetails.value && mealDetails.value.prices) {
        const priceForRole = mealDetails.value.prices.find(price => price.priceType === selectedRole.value);
        return priceForRole ? priceForRole.price : 'Keine Preisinformation verfügbar';
      }
      return 'Keine Preisinformation verfügbar';
    });

    const filteredBadges = computed(() => {
      if (mealDetails.value && mealDetails.value.badges) {
        return mealDetails.value.badges.filter(badge => badge.name !== 'Vegan' && badge.name !== 'Vegetarisch');
      }
      return [];
    });

    const addToFavorites = async () => {
      if (mealDetails.value) {
        try {
          const existingMeal = await fav_db.meal.get(mealDetails.value.id);
          if (existingMeal) {
            alert("Wissen wir schon: Isst du gerne :)"); // Simple alert, replace with custom popup if needed
          } else {
            await fav_db.meal.add({
              id: mealDetails.value.id,
              name: mealDetails.value.name,
              mealReviews: {
                averageRating: mealDetails.value.mealReviews?.averageRating,
                comment: mealDetails.value.mealReviews?.comment
              }
            });
            console.log("Meal added to favorites");
          }
        } catch (error) {
          console.error("Error handling favorites:", error);
        }
      }
    };





    onMounted(async () => {
      console.log(selectedRole.value)
      console.log(mealId.value)
      if (mealId.value) {
        try {
          const response = await axios.get(`https://mensa.gregorflachs.de/api/v1/meal?ID=${mealId.value}&loadingtype=complete`, {

            headers: {
              'X-API-KEY': process.env.VUE_APP_API_KEY
            }
          });
          mealDetails.value = response.data[0];
        } catch (error) {
          console.error('Error fetching meal details:', error);
        }
      }
    });



    return {
      mealId,
      mealDetails,
      selectedRole,
      displayPrice,
      filteredBadges,
      addToFavorites,
      generateTimestampedHex,
      postMealReview,
      showReviewPopup,
      reviewComment,
      reviewRating,
      submitReview,
      setRating

    };
  },
};
</script>

<style>

.btn-active {
  background-color: #76B900; /* Ist das HTW grün... */
  color: white;
  margin-left: 10px;
}

.review-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 5px;

}

.popup-content input, .popup-content textarea {
  width: 100%;
  margin-bottom: 10px;
}
</style>
