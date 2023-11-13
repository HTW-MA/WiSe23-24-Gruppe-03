import { createRouter, createWebHistory } from 'vue-router';
import Home from '../src/views/HomeComponent.vue'


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    // other routes...
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;