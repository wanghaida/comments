<template>
    <div class="comments-wrap">
        <Point
            v-for="(val, key) in points"
            :key="key"
            :point="val.point"
            :pointSize="pointSize"
            :pointColor="val.color"
            @mouseenter="mouseenter"
            @mouseleave="mouseleave"
        />
    </div>
</template>

<script>
import AV from 'leancloud-storage';
import Point from './Point.vue';

export default {
    components: { Point },
    data() {
        return {
            // API
            api: '',
            // LeanCloud
            appId: '',
            appKey: '',
            appUrl: '',
            // 坐标点原点
            origin: 'center',
            // 坐标点尺寸
            pointSize: 'default',
            // 坐标点颜色
            pointColor: 'random',
            // 坐标点层级
            zIndex: 999,
            // 坐标点数组
            points: [],
        };
    },
    mounted() {
        if (this.api !== '' || this.appId !== '' && this.appKey !== '') this.init();
    },
    methods: {
        // 初始化
        init() {
            AV.init({
                appId: this.appId,
                appKey: this.appKey,
                serverURL: this.appUrl ? this.appUrl : `https://${this.appId.substr(0, 8)}.lc-cn-n1-shared.com`,
            });

            // 生成坐标点
            const query = new AV.Query('Comments');

            query.equalTo('type', 'point');
            query.equalTo('path', window.location.pathname);

            query.find().then((points) => {
                for (let i = 0; i < points.length; i++) {
                    // 计算坐标点位置
                    const point = points[i].get('points').split(',').map(parseFloat);

                    if (points[i].get('origin') === 'center') {
                        point[0] += window.innerWidth / 2;
                    }

                    this.points.push({
                        color: this.pointColor,
                        point,
                    });
                }
            }).catch((error) => {
                console.error(error);
            });

            for (let i = 0; i < 100; i++) {
                this.points.push({
                    color: this.pointColor,
                    point: [1920 * Math.random() << 0, 3000 * Math.random() << 0],
                });
            }

            // 监听双击事件
            this.listen();
        },
        // 监听双击事件
        listen() {
            document.addEventListener('dblclick', (e) => {
                this.points.push({
                    color: this.pointColor,
                    point: [e.pageX, e.pageY],
                });
            });
        },
        mouseenter() {
            console.log('enter');
        },
        mouseleave() {
            console.log('leave');
        },
    },
};
</script>
