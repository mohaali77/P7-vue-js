//On importe toutes les pages qui seront lié aux routes 
import { createRouter, createWebHistory } from "vue-router";
import Connexion from '../views/ConnexionView.vue'
import Inscription from '../views/InscriptionView.vue'
import Accueil from '../views/AccueilView.vue'
import Modifier from '../views/ModifierView.vue'

//on construit les routes
const routes = [
    {
        path: '/',
        component: Connexion,
        name: 'login',
    },

    {
        path: '/inscription',
        component: Inscription

    },
    {
        path: '/accueil',
        component: Accueil

    },
    {
        path: '/edit/:id',
        component: Modifier

    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router