import {createRouter, createWebHistory} from 'vue-router'
import Home from './views/Home.vue'
import Settings from "./views/Settings.vue";

const routes = [
    {path: '/', component: Home},
    {path: '/settings', component: Settings},
    {path: '/:pathMatch(.*)*', component: () => import('./views/NotFound.vue')}
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router