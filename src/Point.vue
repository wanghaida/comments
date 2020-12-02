<template>
    <div class="comments-point animation" :style="style" @mouseenter="mouseenter" @mouseleave="mouseleave" />
</template>

<script>
export default {
    props: ['point'],
    computed: {
        style() {
            return {
                top: `${this.point[1]}px`,
                left: `${this.point[0]}px`,
            };
        },
    },
    methods: {
        mouseenter() {
            console.log('enter');
        },
        mouseleave() {
            console.log('leave');
        },
    },
};
</script>

<style scoped>
.comments-point {
    position: absolute;
    top: 100px;
    left: 50%;
    width: 8px;
    height: 8px;
    background: #1890ff;
    border-color: #1890ff;
    box-sizing: border-box;
    border-radius: 50%;
    transform: translate(-50%);
    box-sizing: border-box;
    cursor: pointer;
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

.comments-point.animation::before {
    animation: point 2s ease-out infinite;
}
.comments-point.animation::after {
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
