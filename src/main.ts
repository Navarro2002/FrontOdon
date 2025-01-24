import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import VueTheMask from 'vue-the-mask';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css'; 
import es from 'element-plus/es/locale/lang/es';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router); 
app.use(ElementPlus, {locale: es});
app.use(VueTheMask);
app.mount('#app');
