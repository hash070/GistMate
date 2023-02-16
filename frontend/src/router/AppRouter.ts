import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
    {path: '/', component: Home},
    {path: '/:pathMatch(.*)*', component: () => import('../views/NotFound.vue')}
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router