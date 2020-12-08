import { createApp } from 'vue-demi';
import Wrap from './Wrap.vue';

// 实例缓存
let instance = null;

class Comments {
    // 初始化状态
    loaded = false;

    constructor(opts) {
        if (instance) {
            if (instance.loaded) instance.root.query();
            return instance;
        }

        // 缺少必要参数
        if (opts.appId === '' || opts.appKey === '') return console.error('缺少必要参数');

        this.opts = opts;

        // 创建挂载点
        const oDiv = document.createElement('div');
        document.body.appendChild(oDiv);

        // 创建实例
        this.app = createApp({ extends: Wrap, data: () => this.opts });
        this.root = this.app.mount(oDiv);

        // SDK 加载
        this.sdkLoader(() => {
            this.root.init();
            this.loaded = true;
        });

        instance = this;
    }

    // SDK 加载
    sdkLoader(callback) {
        if (window.AV) return callback && callback();

        const oScript = document.createElement('script');
        oScript.src = 'https://cdn.jsdelivr.net/npm/leancloud-storage@4.8.0/dist/av-min.js';
        oScript.type = 'text/javascript';
        oScript.onload = () => callback && callback();

        document.getElementsByTagName('head')[0].appendChild(oScript);
    }
}

export default Comments;
