import { createApp } from 'vue'
import App from './App.vue'
import 'amfe-flexible'
import "./style.less"
import { px2rem } from './utils/util'

const app = createApp(App)
app.config.globalProperties.$px2rem = px2rem
app.mount('#app')
