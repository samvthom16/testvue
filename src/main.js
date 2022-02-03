import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './assets/tailwind.css'

import axios from 'axios'
import VueAxios from 'vue-axios'
import './assets/tailwind.css'
import './assets/global.css'

createApp(App).use(VueAxios, axios).use(store).use(router).mount('#app')
