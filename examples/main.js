import { createApp } from 'vue';
import Comments from '../src';
import App from './App.vue';

const comments = new Comments({
    // API（和 ID 二选一，优先于 ID）
    api: '',
    // ID（和 API 二选一）
    appId: '',
    appKey: '',
    // 原点（left/center，默认 center）
    origin: 'center',
    // 尺寸（large/default/small，默认 default）
    // pointSize: 'large',
    // 颜色
    // pointColor: ['#1890ff'],
});
console.log(comments);

createApp(App).mount('#app');
