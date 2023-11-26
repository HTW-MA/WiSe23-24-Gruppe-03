import { createRouter, createWebHistory } from 'vue-router';
import Home from '../src/views/HomeComponent.vue'
import Budget from '../src/views/BudgetComponent.vue'
import SelectOptions from "@/views/SelectOptions.vue";
import MealComponent from "@/views/MealComponent.vue";


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
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
    // other routes...
];

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass:'active',
    routes
});

export default router;
