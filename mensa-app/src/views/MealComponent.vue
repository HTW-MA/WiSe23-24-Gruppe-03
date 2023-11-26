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

  </div>
  <div v-else>
    Suche...
  </div>
</template>

<script>
import {useRoute} from "vue-router";
import {computed, onMounted, ref} from "vue";
import axios from "axios";

export default {
  name: 'MealComponent',
  props: {
    meal: Object,

  },

  setup() {
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
      filteredBadges
    };
  },
};
</script>

<style>
</style>
