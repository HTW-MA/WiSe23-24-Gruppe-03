<template>
  <div class="meal-display" v-if="meal">
    <h2>{{ meal.name }}</h2>
    <p>Kategorie: {{ meal.category }}</p>
    <p>Kosten für dich: {{ meal.price }} €</p>
    <div v-if="meal.badges && meal.badges.length">
      <h3>Badges:</h3>
      <ul>
        <li v-for="badge in meal.badges" :key="badge.id">
          <strong>{{ badge.name }}</strong>: {{ badge.description }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">


import { defineComponent, PropType } from "vue";


interface Meal {
  name: string;
  category: string;
  price: number;
  badges: Array<{
    id: number;
    name: string;
    description: string;
  }>;
}




export default defineComponent({
  name: "SingleMeal",
  props: {
    meal: {
      type: Object as PropType<Meal>,
      required: true
    }
  }
});

</script>

<style scoped>

</style>
