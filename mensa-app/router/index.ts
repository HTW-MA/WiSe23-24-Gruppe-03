import { createRouter, createWebHistory } from 'vue-router';
import Home from '../src/views/HomeComponent.vue'
import Budget from '../src/views/BudgetComponent.vue'
import SelectOptions from "@/views/SelectOptions.vue";
import MealComponent from "@/views/MealComponent.vue";
import GeoLocationTestComponent from "@/views/GeoLocationTestComponent.vue";
import FavoritesView from "@/views/FavoritesView.vue";
import NoInternet from "@/views/NoInternet.vue";


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/favorites',
        name: 'Favorites',
        component: FavoritesView
    },
    {
        path: '/heatDeath',
        name: 'Death',
        component: NoInternet
    },
    {
        path: '/Budget',
        component: Budget
    },
    {
        path: '/Profile',
        component: SelectOptions
    },

    {
        path: '/Meal',
        component: MealComponent
    }

];

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass:'active',
    routes
});

export default router;
