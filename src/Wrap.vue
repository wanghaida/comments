<template>
    <div class="comments-wrap" style="user-select: none;">
        <Comment
            v-show="commentShow"
            ref="comment"
            :path="pointPath"
            :origin="origin"
            :style="commentStyle"
            :points="points"
            :pointsIndex="pointsIndex"
            @mouseenter="mouseenterComment"
            @mouseleave="mouseleaveComment"
            @click.stop
            @dblclick.stop
            @change="changePoint"
        />
        <Point
            v-for="(val, key) in points"
            :data-index="key"
            :key="key"
            :point="val.point"
            :pointSize="pointSize"
            :pointColor="val.color"
            @mouseenter="mouseenter"
            @mouseleave="mouseleave"
            @click.stop
            @dblclick.stop
        />
    </div>
</template>

<script>
import AV from 'leancloud-storage';
import Comment from './Comment.vue';
import Point from './Point.vue';

export default {
    components: { Comment, Point },
    data() {
        return {
            // API
            api: '',
            // LeanCloud
            appId: '',
            appKey: '',
            appUrl: '',
            // 网址路径
            path: 'window.location.pathname',
            // 坐标点原点
            origin: 'center',
            // 坐标点尺寸
            pointSize: 'default',
            // 坐标点颜色
            pointColor: 'random',
            // 坐标点层级
            zIndex: 999,
            // 评论框关闭延时，单位：秒
            delay: 0.1,
            delayTimer: null,
            // 坐标点数组
            points: [],
            pointsIndex: -1,
            // 评论框数据
            commentId: 0,
            commentShow: false,
            commentColor: '',
            commentStyle: {},
        };
    },
    mounted() {
        if (this.api !== '' || this.appId !== '' && this.appKey !== '') this.init();
    },
    methods: {
        // 初始化
        init() {
            if (this.api !== '') return console.error('暂不支持接口地址');

            AV.init({
                appId: this.appId,
                appKey: this.appKey,
                serverURL: this.appUrl ? this.appUrl : `https://${this.appId.substr(0, 8)}.lc-cn-n1-shared.com`,
            });

            // 查询坐标点
            this.query();

            // 监听双击事件
            this.listen();
        },
        // 查询坐标点
        query() {
            this.points = [];

            const query = new AV.Query('Comments');

            query.equalTo('type', 'point');
            query.equalTo('path', this.pointPath());

            query.find().then((points) => {
                for (let i = 0; i < points.length; i++) {
                    // 计算坐标点位置
                    const point = points[i].get('points').split(',').map(parseFloat);

                    if (points[i].get('origin') === 'center') {
                        point[0] += window.innerWidth / 2;
                    }

                    this.points.push({
                        id: points[i].id,
                        color: this.pointColor,
                        point,
                    });
                }
            }).catch((error) => {
                console.error(error);
            });
        },
        // 监听双击事件
        listen() {
            document.addEventListener('dblclick', (e) => {
                const point = {
                    id: 0,
                    color: this.pointColor,
                    point: [e.pageX, e.pageY],
                };
                this.points.push(point);
            });
        },
        // 移入坐标点
        mouseenter(e) {
            this.commentShow = true;

            // 屏幕信息
            const w = window.innerWidth;
            const h = window.innerHeight;
            // 坐标点信息
            const point = e.target;
            const { top, left } = point.getBoundingClientRect();
            const pTop = parseFloat(point.style.top, 10);
            const pLeft = parseFloat(point.style.left, 10);
            // 评论框信息
            const style = getComputedStyle(this.$refs.comment.$el);
            const width = parseFloat(style.width, 10);
            const height = parseFloat(style.height, 10);

            // 参数设置
            this.pointsIndex = point.dataset.index;
            // 位置判定
            if ((left + width) < (w - 20) && (top + height) < h) {
                // 判定右下
                this.commentStyle = {
                    top: `${pTop}px`,
                    left: `${pLeft + 20}px`,
                    zIndex: this.zIndex + 1,
                };
            } else if ((left - width) > (0 + 20) && (top + height) < h) {
                // 判定左下
                this.commentStyle = {
                    top: `${pTop}px`,
                    left: `${pLeft - width - 20}px`,
                    zIndex: this.zIndex + 1,
                };
            } else if ((left + width) < (w - 20) && (top - height) > 0) {
                // 判定右上
                this.commentStyle = {
                    top: `${pTop - height}px`,
                    left: `${pLeft + 20}px`,
                    zIndex: this.zIndex + 1,
                };
            } else if ((left - width) > (0 + 20) && (top - height) > 0) {
                // 判定左上
                this.commentStyle = {
                    top: `${pTop - height}px`,
                    left: `${pLeft - width - 20}px`,
                    zIndex: this.zIndex + 1,
                };
            } else if (left * 2 < w) {
                // 判断左侧空白较大，用左下
                this.commentStyle = {
                    top: `${pTop}px`,
                    left: `${pLeft - width}px`,
                    zIndex: this.zIndex + 1,
                };
            } else {
                // 判断右侧空白较大，用右下
                this.commentStyle = {
                    top: `${pTop}px`,
                    left: `${pLeft}px`,
                    zIndex: this.zIndex + 1,
                };
            }
        },
        // 移出坐标点
        mouseleave() {
            clearTimeout(this.delayTimer);
            this.delayTimer = setTimeout(() => {
                this.commentShow = false;
            }, this.delay < 0.1 ? 100 : this.delay * 1000);
        },
        // 移入评论框
        mouseenterComment() {
            clearTimeout(this.delayTimer);
        },
        // 移出评论框
        mouseleaveComment() {
            this.mouseleave();
        },
        // 修改坐标点
        changePoint(index, payload) {
            if (this.points[index]) {
                this.points[index].id = payload.id;
            }
        },
        // 网址路径
        pointPath() {
            let path = this.path;

            if (this.path.includes('location.path')) {
                path = window.location.pathname;
            }
            if (this.path.includes('location.href')) {
                path = window.location.href;
            }

            return path;
        },
    },
};
</script>
