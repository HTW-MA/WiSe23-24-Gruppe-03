I have this component:

<template>
  <div v-if="mealDetails">
    <h2>{{ mealDetails.name }}</h2>

    <p>Kosten für dich:  {{ displayPrice }} € </p>

    <div v-if="filteredBadges && filteredBadges.length>0">
      <h3>Badges:</h3>
      <ul>
        <li v-for="badge in filteredBadges" :key="badge.id">
          <strong>{{ badge.name }}</strong>: {{ badge.description }}
        </li>
      </ul>
    </div>
    <div v-if="filteredAdditives && filteredAdditives.length>0">
      <h3>Zusatzstoffe:</h3>
      <ul>
        <li v-for="additive in filteredAdditives" :key="additive.id">
          <p>{{ additive.text }}</p>
        </li>
      </ul>
    </div>

    <button class="htw-btn-active" @click="showReviewPopup = true">Bewertung abgeben</button>
    <div v-if="showReviewPopup" class="review-popup">
      <div class="popup-content">
        <h3>Bewertung abgeben</h3>
        <div class="star-rating">
  <span v-for="item in 5" :key="item" @click="setRating(item, $event.offsetX < $event.target.offsetWidth / 2)">
    <img :src="getChickenImage(item)" alt="rating symbol" class="small-image" />
  </span>
        </div>

        <textarea v-model="reviewComment" placeholder="Kommentar"></textarea>
        <button @click="submitReview" class="htw-btn-active">Senden</button>
        <button @click="showReviewPopup = false" class="htw-btn-active">Abbrechen</button>


      </div>
    </div>

    <button class="htw-btn-active" @click="addToFavorites">Zu Lieblingsessen hinzufügen</button>

    <div v-if="showFavoritePopup" class="favorite-popup">
      <div class="popup-content">
        <p>Alles klar. Wir geben dir bescheid, wenn es dieses Essen gibt:)</p>
        <button @click="showFavoritePopup = false" class="htw-btn-active">Schließen</button>
      </div>
    </div>
    <button class="htw-btn-active" @click="goToHome">Zurück</button>



  </div>

</template>

<script>
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import fav_db from "@/fav_db";
//import SingleMeal from "@/components/SingleMeal.vue";




export default {
  name: 'MealComponent',
  methods: {useRouter},
  props: {
    meal: Object,

  },
  //components:{
  //  SingleMeal
  //},
  setup() {


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


    function setRating(newRating, isHalf = false) {
      starRating.value = isHalf ? newRating - 0.5 : newRating;
    }
    function getChickenImage(item) {
      const image = starRating.value >= item
          ? filledSymbol
          : starRating.value >= item - 0.5
              ? halfSymbol
              : emptySymbol;
      console.log("Item: ", item, "Image: ", image);
      return image;
    }

    function submitReview() {
      if (starRating.value&& reviewComment.value) {


         const reviewBody = {
          mealId: mealDetails.value.id,
           rating: starRating.value,
           comment: reviewComment.value,
           category: mealDetails.value.category
         };

         console.log('Review Data:', reviewBody);

        postMealReview(mealDetails.value.id, starRating.value, reviewComment.value, mealDetails.value.category);
        showReviewPopup.value = false;
        reviewComment.value = '';
        starRating.value = 0;
      } else {
        alert('Bitte geben Sie eine Bewertung und einen Kommentar ein.');
      }
    }

    async function postMealReview(mealID, rating, comment, category) {

      const userID = localStorage.getItem('userID')

      const config = {
        headers: {
          'X-API-KEY': process.env.VUE_APP_API_KEY
        }
      };

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
        console.log(response.data);

      } catch (error) {
        if (error.response.status === 409){
          try{
            const response = await axios.put('https://mensa.gregorflachs.de/api/v1/mealreview/', review, config);
            console.log(response.data)
            console.log('put')
          }
          catch (error){
            console.error('Fehler beim Posten:', error);
          }
        }
        console.error('Fehler beim Posten:', error);

      }
    }

    const showReviewPopup = ref(false);
    const reviewComment = ref('');
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


    const router = useRouter();
    const goToHome = () => {
      router.push('/');
    };

    const mealDetails = ref(null);
    const selectedRole = ref(localStorage.getItem('selectedRole') || 'defaultRole');
    const loseWeight = ref(localStorage.getItem('loseWeight')|| 'defaultRole');

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

    const filteredAdditives = computed(()=>{
      console.log("hallo")
      if(mealDetails.value && mealDetails.value.additives){
        console.log("asdfasdf"+mealDetails.value.additives)
        return mealDetails.value.additives
      }
      return [];
    });

    const addToFavorites = async () => {
      if (mealDetails.value) {
        try {
          const existingMeal = await fav_db.meal.get(mealDetails.value.id);
          if (existingMeal) {
            alert("Wissen wir schon: Isst du gerne :)");
          } else {
            await fav_db.meal.add({
              id: mealDetails.value.id,
              name: mealDetails.value.name,
              mealReviews: {
                averageRating: mealDetails.value.mealReviews?.averageRating,
                comment: mealDetails.value.mealReviews?.comment
              }
            });
            showFavoritePopup.value=true
            setTimeout(() => {
              showFavoritePopup.value = false;
            }, 3000);
          }
        } catch (error) {
          console.error("Fehler mit den Favoriten:", error);
        }
      }
    };





    onMounted(async () => {


      if (mealId.value) {
        try {
          const response = await axios.get(`https://mensa.gregorflachs.de/api/v1/meal?ID=${mealId.value}&loadingtype=complete`, {

            headers: {
              'X-API-KEY': process.env.VUE_APP_API_KEY
            }
          });
          mealDetails.value = response.data[0];
        } catch (error) {
          console.error('Fehler beim holen der Speiße:', error);
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
      setRating,
      starRating,
      filledSymbol,
      emptySymbol,
      halfSymbol,
      selectedDiet,
      showFavoritePopup,
      goToHome,
      loseWeight,
      filteredAdditives,
      getChickenImage


    };
  },
};
</script>

<style>

.htw-btn-active {
  background-color: #76B900;
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
  padding: 5%;
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

h2, h3, p {
  font-size: 1vw;
}
.small-image {

  width: 5vw;
  height: auto;
  max-width: 100px;
}

.favorite-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.favorite-popup p {
  margin: 10px 0;
}

.favorite-popup button {
  background-color: #76B900;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.favorite-popup button:hover {
  background-color: #659700;
}


</style>
