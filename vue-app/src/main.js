import { createApp } from 'vue'
//on importe le fichier de notre application
import App from './App.vue'
//on importe un fichier css global qui sera appliqué sur tout le projet
import "./global.css"
//on importe routeur pour pouvoir créer nos route qui nous servirons à naviguer sur nos différentes pages
import router from './routeur'
//on importe axios qui nous permettra de faire des appels api
import './axios'
createApp(App).use(router).mount('#app')