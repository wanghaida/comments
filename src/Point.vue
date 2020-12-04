<template>
    <div class="comments-point" :class="pointSize" :style="style" />
</template>

<script>
export default {
    props: ['point', 'pointSize', 'pointColor'],
    data() {
        return {
            theme: ['red', 'volcano', 'orange', 'gold', 'yellow', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple', 'magenta'],
            themeArr: [
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
            ],
        };
    },
    computed: {
        style() {
            const style = {
                top: `${this.point[1]}px`,
                left: `${this.point[0]}px`,
            };

            let color = '#1890ff';

            if (Array.isArray(this.pointColor)) {
                color = this.random(this.pointColor);
            } else if (this.pointColor === 'random' || this.theme.indexOf(this.pointColor) === -1) {
                color = this.random(this.themeArr)[2];
            } else {
                color = this.random(this.themeArr[this.theme.indexOf(this.pointColor)]);
            }

            style.background = color;
            style.borderColor = color;

            return style;
        },
    },
    methods: {
        random(array) {
            return Array.isArray(array) ? array[array.length * Math.random() << 0] : [];
        },
    },
};
</script>

<style scoped>
.comments-point {
    position: absolute;
    width: 8px;
    height: 8px;
    box-sizing: border-box;
    border-radius: 50%;
    transform: translate(-50%);
    box-sizing: border-box;
    cursor: pointer;
}
.comments-point.large {
    width: 10px;
    height: 10px;
}
.comments-point.small {
    width: 6px;
    height: 6px;
}

.comments-point::before,
.comments-point::after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: block;
    border: 1px solid;
    border-color: inherit;
    border-radius: 50%;
    box-sizing: border-box;
    content: '';
    pointer-events: none;
}
.comments-point::before {
    animation: point 2s ease-out infinite;
}
.comments-point::after {
    animation: point 2s 1s ease-out infinite;
}

@keyframes point {
    0% {
        opacity: .25;
    }
    100% {
        opacity: 0;
        transform: scale(3);
    }
}
</style>
