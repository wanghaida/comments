<template>
    <div class="comments-wrap">
        <Point v-for="(val, key) in points" :key="key" :point="val.point" />
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
            console.log('init', AV);
            for (let i = 0; i < 100; i++) {
                const x = 1920 * Math.random() << 0;
                const y = 3000 * Math.random() << 0;

                this.points.push({
                    point: [x, y],
                });
            }
        },
    },
};
</script>
