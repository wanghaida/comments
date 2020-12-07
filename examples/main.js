import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import Comments from '../src';
import App from './App.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: () => import('./views/Index.vue') },
        { path: '/a', component: () => import('./views/A.vue') },
        { path: '/b', component: () => import('./views/B.vue') },
        { path: '/match', component: () => import('./views/Match.vue') },
    ],
});

router.afterEach(() => {
    new Comments({
        appId: '',
        appKey: '',
    });
});

createApp(App).use(router).mount('#app');
