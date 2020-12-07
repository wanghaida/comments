import { createApp } from 'vue-demi';
import Wrap from './Wrap.vue';

let instance = null;

class Comments {
    constructor(opts) {
        if (instance) {
            instance.root.query();
            return instance;
        }

        this.opts = opts;
        this.app = null;
        this.dom = null;
        this.root = null;

        // 缺少必要参数
        if (opts.appId === '' || opts.appKey === '') return console.error('缺少必要参数');

        this.create();
        instance = this;
    }

    create() {
        // 创建挂载点
        this.dom = document.createElement('div');
        document.body.appendChild(this.dom);

        // 创建实例
        this.app = createApp({ extends: Wrap, data: () => this.opts });
        this.root = this.app.mount(this.dom);
    }
}

export default Comments;
