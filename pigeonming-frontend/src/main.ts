import './assets/main.css'
import '@creatorsn/vfluent3/style.css'

import { createApp } from 'vue'
import VFluent3 from '@creatorsn/vfluent3'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(VFluent3)
app.use(router)

app.mount('#app')
