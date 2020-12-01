import { createApp } from 'vue-demi';
import Wrap from './Wrap.vue';

class Comments {
    constructor(opts) {
        this.opts = opts;

        this.app = null;
        this.dom = null;

        this.create();
    }

    create() {
        if (this.app) return;

        // 创建挂载点
        this.dom = document.createElement('div');
        document.body.appendChild(this.dom);

        // 创建实例
        this.app = createApp(Wrap);
        this.app.mount(this.dom);
    }
}

export default Comments;
