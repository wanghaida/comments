import { createApp } from 'vue';
import Comments from '../src';
import App from './App.vue';

new Comments({
    // API（和 ID 二选一，优先于 ID）
    api: '',
    // ID（和 API 二选一）
    appId: '',
    appKey: '',
    // 原点（left/center，默认 center）
    origin: 'center',
    // 尺寸（large/default/small，默认 default）
    pointSize: 'large',
    // 颜色
    pointColor: ['#f00', '#0f0', '#00f', 'rgba(255,255,255,0.5)'],
});

createApp(App).mount('#app');
