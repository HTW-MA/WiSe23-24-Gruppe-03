import { createRouter, createWebHistory } from 'vue-router';
import Home from '../src/views/HomeComponent.vue'
import Budget from '../src/views/BudgetComponent.vue'


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/Budget',
        component: Budget
    }
    // other routes...
];

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass:'active',
    routes
});

export default router;
