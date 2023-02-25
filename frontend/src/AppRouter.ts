import {createRouter, createWebHistory} from 'vue-router'
import Home from './views/Home.vue'
import Settings from "./views/Settings.vue";
import OAuth from "./components/OAuth.vue";
import Docs from "./views/Docs.vue";

const routes = [
    {path: '/', component: Home},
    {path: '/settings', component: Settings},
    {path: '/oauth', component: OAuth},
    {path: '/docs', component: Docs},
    {path: '/:pathMatch(.*)*', component: () => import('./views/NotFound.vue')}
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router