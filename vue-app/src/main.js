import { createApp } from 'vue'
import App from './App.vue'
import "./global.css"
import router from './routeur'
import './axios'
createApp(App).use(router).mount('#app')

