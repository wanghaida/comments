import md5 from 'md5';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { h } from 'snabbdom/build/package/h';
import { init } from 'snabbdom/build/package/init';
import { propsModule } from 'snabbdom/build/package/modules/props';
import { styleModule } from 'snabbdom/build/package/modules/style';
import { datasetModule } from 'snabbdom/build/package/modules/dataset';
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners';
import { spaRouterListener } from './utils';

dayjs.extend(relativeTime);

// 实例缓存
let instance = null;

class Comments {
    // 加载状态
    loaded = false;

    constructor(opts) {
        if (instance) {
            if (instance.loaded) instance.query();
            return instance;
        }

        // 缺少必要参数
        if (!opts.appId || !opts.appKey) return console.error('Missing required arguments');

        // 参数
        this.opts = Object.assign({
            api: '',
            appId: '',
            appKey: '',
            appUrl: '',
            close: 'delay',
            delay: 0.1,
            gravatar: 'mp',
            gravatarCDN: 'https://www.gravatar.com',
            origin: 'center',
            path: 'window.location.pathname',
            pointColor: 'random',
            pointRange: 'default',
            pointSize: 'default',
            zIndex: 999,
        }, opts);
        // 数据
        this.data = {
            point: null,
            pointDom: null,
            style: {},
            timer: null,
        };

        // 评论列表
        this.comments = [];
        this.commentsDom = null;
        // 坐标点列表
        this.points = [];
        this.pointsDom = null;

        // 创建挂载点
        this.dom = document.createElement('div');
        document.body.appendChild(this.dom);

        this.patch = init([
            propsModule,
            styleModule,
            datasetModule,
            eventListenersModule,
        ]);

        // CSS 加载
        require('./assets/style.css');
        // SDK 加载
        this.sdkLoader(() => {
            this.init();
            this.loaded = true;
        });

        instance = this;
        return instance;
    }

    // 初始化
    init() {
        window.AV.init({
            appId: this.opts.appId,
            appKey: this.opts.appKey,
            serverURL: this.opts.appUrl ? this.opts.appUrl : `https://${this.opts.appId.substr(0, 8)}.lc-cn-n1-shared.com`,
        });

        // 查询坐标点
        this.query();

        // 监听事件
        this.listen();
    }

    // 查询坐标点
    query() {
        const query = new window.AV.Query('Comments');

        query.equalTo('type', 'point');
        query.equalTo('path', this.path());

        query.find().then((points) => {
            this.points = [];
            for (let i = 0; i < points.length; i++) {
                // 计算坐标点位置
                const point = points[i].get('points').split(',').map(parseFloat);

                if (points[i].get('origin') === 'center') {
                    point[0] += window.innerWidth / 2;
                }

                this.points.push({
                    id: points[i].id,
                    color: this.color(),
                    point,
                });
            }
            // 渲染
            this.render();
        }).catch(console.error);
    }

    // 监听事件
    listen() {
        document.addEventListener('click', (e) => {
            if (this.opts.close !== 'delay' && !this.commentsDom?.elm?.contains(e.target)) {
                this.data.point = null;
                this.data.pointDom = null;
                this.render();
            }
        });
        document.addEventListener('dblclick', (e) => {
            const point = {
                id: 0,
                color: this.color(),
                point: [e.pageX, e.pageY],
            };
            this.points.push(point);
            // 渲染
            this.render();
        });
        // SPA
        history.pushState = spaRouterListener('pushState');
        window.addEventListener('popstate', () => this.query());
        window.addEventListener('pushstate', () => this.query());
        window.addEventListener('popState', () => this.query());
        window.addEventListener('pushState', () => this.query());
    }

    // 保存坐标点
    save() {
        const oName = document.getElementById('uquuu-comments-name');
        const oEmail = document.getElementById('uquuu-comments-email');
        const oComment = document.getElementById('uquuu-comments-comment');

        if (!oName.value || !oComment.value) {
            this.message('昵称和评论必填哦😋');
            return;
        }

        // 保存用户信息
        localStorage.setItem('uquuu_comments_name', oName.value);
        localStorage.setItem('uquuu_comments_email', oEmail.value);

        if (!this.data.point) return;

        // 新增坐标点
        if (this.data.point.id === 0) {
            const comments = new window.AV.Object('Comments');

            comments.set('type', 'point');
            comments.set('path', this.path());
            comments.set('origin', this.opts.origin);

            let [x, y] = this.data.point.point;
            if (this.opts.origin === 'center') {
                x -= window.innerWidth / 2;
            }

            comments.set('points', `${x},${y}`);
            comments.set('ua', window.navigator.userAgent);
            comments.set('screen', `${window.screen.width},${window.screen.height}`);

            comments.save().then((comment) => {
                this.saveComment({
                    id: comment.id,
                    name: oName.value,
                    email: oEmail.value,
                    oComment,
                });
            }).catch(console.error);
        } else {
            this.saveComment({
                id: this.data.point.id,
                name: oName.value,
                email: oEmail.value,
                oComment,
            });
        }
    }

    // 保存评论
    saveComment({ id, name, email, oComment }) {
        // 保存评论数据
        const comments = new window.AV.Object('Comments');

        comments.set('type', 'comment');
        comments.set('parent_id', id);
        comments.set('name', name);
        comments.set('email', email);
        comments.set('comment', oComment.value);
        comments.set('ua', window.navigator.userAgent);
        comments.set('screen', `${window.screen.width},${window.screen.height}`);

        comments.save().then((comment) => {
            oComment.value = '';
            this.message('评论成功');
            this.comments.unshift({
                name: comment.get('name'),
                email: comment.get('email'),
                comment: comment.get('comment'),
                createdAt: dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm:ss'),
            });
            // 渲染
            this.render();
        }).catch(() => {
            this.message('评论失败');
        });
    }

    // 消息提醒
    message(tips = '') {
        const oTips = document.getElementById('uquuu-comments-tips');
        oTips.innerText = tips;
        setTimeout(() => {
            oTips.innerText = '';
        }, 3000);
    }

    // Path 计算
    path() {
        let path = this.opts.path;

        if (path.includes('location.pathname')) {
            return window.location.pathname;
        }
        if (path.includes('location.href')) {
            return window.location.href;
        }

        return path;
    }

    // Color 计算
    color() {
        const theme = ['red', 'volcano', 'orange', 'gold', 'yellow', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple', 'magenta'];
        const themeArr = [
            ['#ff7875', '#ff4d4f', '#f5222d', '#cf1322'],
            ['#ff9c6e', '#ff7a45', '#fa541c', '#d4380d'],
            ['#ffc069', '#ffa940', '#fa8c16', '#d46b08'],
            ['#ffd666', '#ffc53d', '#faad14', '#d48806'],
            ['#fff566', '#ffec3d', '#fadb14', '#d4b106'],
            ['#d3f261', '#bae637', '#a0d911', '#7cb305'],
            ['#95de64', '#73d13d', '#52c41a', '#389e0d'],
            ['#5cdbd3', '#36cfc9', '#13c2c2', '#08979c'],
            ['#69c0ff', '#40a9ff', '#1890ff', '#096dd9'],
            ['#85a5ff', '#597ef7', '#2f54eb', '#1d39c4'],
            ['#b37feb', '#9254de', '#722ed1', '#531dab'],
            ['#ff85c0', '#f759ab', '#eb2f96', '#c41d7f'],
        ];
        let color = '#1890ff';

        if (Array.isArray(this.opts.pointColor)) {
            color = this.random(this.opts.pointColor);
        } else if (this.opts.pointColor === 'random' || theme.indexOf(this.opts.pointColor) === -1) {
            color = this.random(themeArr)[2];
        } else {
            color = this.random(themeArr[theme.indexOf(this.opts.pointColor)]);
        }

        return color;
    }

    // Random 计算
    random(array) {
        return Array.isArray(array) ? array[Math.floor(array.length * Math.random())] : array;
    }

    // 渲染
    render() {
        this.commentsDom = this.renderComments();
        this.pointsDom = this.renderPoints();

        this.dom = this.patch(this.dom, h('div.uq-comments', [this.commentsDom, ...this.pointsDom]));
    }

    // 渲染 评论列表
    renderComments() {
        let color = this.data.pointDom?.style?.backgroundColor || 'rgb(24, 144, 255)';

        color = color.replace(/.+\((.+)\)/, '$1').split(',').map(parseFloat);
        color.length = 3;
        color = color.join(',');

        const comments = [];

        for (let i = 0; i < this.comments.length; i++) {
            const comment = this.comments[i];
            comments.push(h('li', [
                h('div.uq-comment-author', [
                    h('span.uq-comment-author-avatar', {
                        style: {
                            display: this.opts.gravatar === false ? 'none' : '',
                        },
                    }, [
                        h('img', {
                            props: {
                                src: `${this.opts.gravatarCDN}/avatar/${md5(comment.email)}?d=${this.opts.gravatar}&s=22`,
                            },
                        }),
                    ]),
                    h('span.uq-comment-author-name', {
                        props: {
                            title: comment.name,
                        },
                    }, [
                        comment.name,
                    ]),
                    h('span.uq-comment-author-time', {
                        props: {
                            title: comment.createdAt,
                        },
                    }, [
                        dayjs().to(comment.createdAt),
                    ]),
                ]),
                h('div.uq-comment-detail', [
                    h('p', [
                        comment.comment,
                    ]),
                ]),
            ]));
        }

        if (comments.length === 0) {
            comments.push(h('li.nodata', [
                h('img', {
                    props: {
                        src: require('./assets/empty.png'),
                    },
                }),
                'No Data',
            ]));
        }

        return h('div.uq-comment', {
            style: {
                display: this.data.point ? 'block' : 'none',
                boxShadow: `0 1px 2px -2px rgba(${color}, .16), 0 3px 6px 0 rgba(${color}, .12), 0 5px 12px 4px rgba(${color}, .09)`,
                zIndex: this.opts.zIndex + 1,
                ...this.data.style,
            },
            on: {
                dblclick: (e) => e.stopPropagation(),
                mouseenter: (e) => this.mouseenterComment(e),
                mouseleave: (e) => this.mouseleaveComment(e),
            },
        }, [
            h('ul', [...comments]),
            h('div.uq-comment-publish', {
                style: {
                    borderColor: `rgba(${color}, .65)`,
                },
            }, [
                h('div.uq-comment-publish-header', [
                    h('input#uquuu-comments-name', {
                        props: {
                            type: 'text',
                            placeholder: '昵称',
                            autocomplete: 'off',
                            value: localStorage.getItem('uquuu_comments_name') || '',
                        },
                    }),
                    h('input#uquuu-comments-email', {
                        props: {
                            type: 'email',
                            placeholder: '邮箱',
                            autocomplete: 'off',
                            value: localStorage.getItem('uquuu_comments_email') || '',
                        },
                    }),
                ]),
                h('div.uq-comment-publish-editor', {
                    style: {
                        borderColor: `rgba(${color}, .65)`,
                    },
                }, [
                    h('textarea#uquuu-comments-comment', {
                        props: {
                            placeholder: '还不来评论一下？😘',
                        }
                    }),
                ]),
                h('div.uq-comment-publish-footer', {
                    style: {
                        borderColor: `rgba(${color}, .65)`,
                    },
                }, [
                    h('div#uquuu-comments-tips.tips'),
                    h('button.submit', {
                        style: {
                            color: `rgba(${color}, .65)`,
                        },
                        on: {
                            click: () => this.save(),
                        },
                    }, [
                        '评论',
                    ]),
                ]),
            ]),
        ]);
    }

    // 渲染 坐标点列表
    renderPoints() {
        const points = [];

        for (let i = 0; i < this.points.length; i++) {
            const point = this.points[i];
            points.push(h(`div.uq-point.uq-point-${this.opts.pointSize}.uq-point-range-${this.opts.pointRange}`, {
                dataset: {
                    index: '' + i,
                },
                style: {
                    top: `${point.point[1]}px`,
                    left: `${point.point[0]}px`,
                    color: point.color,
                    backgroundColor: point.color,
                    zIndex: this.opts.zIndex,
                },
                on: {
                    dblclick: (e) => e.stopPropagation(),
                    mousemove: (e) => this.mouseenterPoint(e),
                    mouseenter: (e) => this.mouseenterPoint(e),
                    mouseleave: (e) => this.mouseleavePoint(e),
                },
            }));
        }

        return points;
    }

    // 移入评论框
    mouseenterComment() {
        clearTimeout(this.data.timer);
    }

    // 移出评论框
    mouseleaveComment(e) {
        // 假移出（比如移动到：自动填充、输入法候选框）
        if (!e.relatedTarget) return;

        this.mouseleavePoint();
    }

    // 移入坐标点
    mouseenterPoint({ target: dom }) {
        if (this.data.pointDom === dom) return;

        // 屏幕信息
        const w = window.innerWidth;
        const h = window.innerHeight;
        // 坐标点信息
        const { top, left } = dom.getBoundingClientRect();
        const pTop = parseFloat(dom.style.top, 10);
        const pLeft = parseFloat(dom.style.left, 10);
        // 评论框信息
        const width = 300;
        const height = 400;

        // 位置判定
        let nTop = 0;
        let nLeft = 0;
        if ((left + width) < (w - 20) && (top + height) < h) {
            // 判定右下
            nTop = pTop;
            nLeft = pLeft + 20;
        } else if ((left - width) > (0 + 20) && (top + height) < h) {
            // 判定左下
            nTop = pTop;
            nLeft = pLeft - width - 20;
        } else if ((left + width) < (w - 20) && (top - height) > 0) {
            // 判定右上
            nTop = pTop - height;
            nLeft = pLeft + 20;
        } else if ((left - width) > (0 + 20) && (top - height) > 0) {
            // 判定左上
            nTop = pTop - height;
            nLeft = pLeft - width - 20;
        } else if (left * 2 < w) {
            // 判断左侧空白较大，用左下
            nTop = pTop;
            nLeft = pLeft - width;
        } else {
            // 判断右侧空白较大，用右下
            nTop = pTop;
            nLeft = pLeft;
        }

        this.data.point = this.points[dom.dataset.index];
        this.data.pointDom = dom;
        this.data.style = {
            top: `${nTop}px`,
            left: `${nLeft}px`,
        };
        this.comments = [];

        // 渲染
        this.render();

        // 新增坐标点
        if (this.data.point.id === 0) return;

        // 生成评论数据
        const query = new window.AV.Query('Comments');

        query.equalTo('type', 'comment');
        query.equalTo('parent_id', this.data.point.id);
        query.descending('createdAt')

        query.find().then((comments) => {
            for (let i = 0; i < comments.length; i++) {
                this.comments.push({
                    name: comments[i].get('name'),
                    email: comments[i].get('email'),
                    comment: comments[i].get('comment'),
                    createdAt: dayjs(comments[i].createdAt).format('YYYY-MM-DD HH:mm:ss'),
                });
            }
            // 渲染
            this.render();
        }).catch(console.error);
    }

    // 移出坐标点
    mouseleavePoint() {
        if (this.opts.close !== 'delay') return;

        clearTimeout(this.data.timer);
        this.data.timer = setTimeout(() => {
            this.data.point = null;
            this.data.pointDom = null;
            this.render();
        }, this.opts.delay < 0.1 ? 100 : this.opts.delay * 1000);
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
