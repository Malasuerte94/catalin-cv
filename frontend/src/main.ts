import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css';
import { vRevealText } from './directives/revealText';

const app = createApp(App);
const pinia = createPinia();

app.directive('reveal-text', vRevealText);
app.use(pinia);
app.use(router);

app.mount('#app');
