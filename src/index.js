import { createApp } from 'vue-demi';
import Wrap from './Wrap.vue';

class Comments {
    constructor(opts) {
        this.opts = opts;

        // 已经实例化
        if (this.root) {
            return this.root.query();
        }

        // 还未实例化
        this.app = null;
        this.dom = null;
        this.root = null;

        if (opts.appId && opts.appKey) {
            this.sdkLoader(
                'https://cdn.jsdelivr.net/npm/leancloud-storage@4.8.0/dist/av-min.js',
                this.create.bind(this),
            );
        }
    }

    create() {
        if (this.app) return;

        // 创建挂载点
        this.dom = document.createElement('div');
        document.body.appendChild(this.dom);

        // 创建实例
        this.app = createApp({ extends: Wrap, data: () => this.opts });
        this.root = this.app.mount(this.dom);
    }

    sdkLoader(url, callback) {
        if (window.AV) return callback && callback();

        const oScript = document.createElement('script');
        oScript.src = url;
        oScript.type = 'text/javascript';
        oScript.onload = () => callback && callback();

        document.getElementsByTagName('head')[0].appendChild(oScript);
    }
}

export default Comments;
