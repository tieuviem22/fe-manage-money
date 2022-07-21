import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import axios from 'axios';
import VueAxios from 'vue-axios';
import ApiService from './config/api.service';
import { pinia } from './store';

ApiService.init();


createApp(App).use(pinia).use(router).use(Antd).use(VueAxios, axios).mount('#app')
