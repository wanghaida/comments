<template>
    <div class="comments-comment" :style="box">
        <ul class="comments" v-show="comments.length">
            <li v-for="(val, key) in comments" :key="key">
                <div class="comment">
                    <div class="comment-author">
                        <span class="avatar">
                            <img src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" alt="">
                        </span>
                        <span class="name" :title="val.name">
                            {{ val.name }}
                        </span>
                        <span class="time" :title="val.createdAt">
                            {{ time(val.createdAt) }}
                        </span>
                    </div>
                    <div class="comment-detail">
                        <p>{{ val.comment }}</p>
                    </div>
                </div>
            </li>
        </ul>
        <div class="comments-nodata" v-show="!comments.length">
            <img src="./empty.png" />
            暂无数据
        </div>
        <div class="comments-new" :style="borderColor">
            <div class="new-header">
                <input v-model="name" type="text" placeholder="昵称" autocomplete="off">
                <input v-model="email" type="email" placeholder="邮箱" autocomplete="off">
            </div>
            <div class="new-editer" :style="borderColor">
                <textarea v-model="comment" name="comment" placeholder="还不来评论一下？😘"></textarea>
            </div>
            <div class="new-footer" :style="borderColor">
                <div class="tips" v-html="tips"></div>
                <button class="submit" :style="color" @click="save">评论</button>
            </div>
        </div>
    </div>
</template>

<script>
import AV from 'leancloud-storage';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

export default {
    props: ['id', 'pointColor'],
    data() {
        return {
            tips: '',
            name: '',
            email: '',
            comment: '',
            comments: [],
        };
    },
    computed: {
        time() {
            return (time) => dayjs().from((time));
        },
        rgba() {
            return this.pointColor.replace(/rgb\((.+)\)/, 'rgba($1, .65)');
        },
        backgroundColor() {
            return {
                backgroundColor: this.rgba,
            };
        },
        borderColor() {
            return {
                borderColor: this.rgba,
            };
        },
        color() {
            return {
                color: this.rgba,
            };
        },
        box() {
            const color = this.pointColor.replace(/rgb\((.+)\)/, '$1');
            return {
                boxShadow: `0 1px 2px -2px rgba(${color}, .16), 0 3px 6px 0 rgba(${color}, .12), 0 5px 12px 4px rgba(${color}, .09)`,
            };
        },
    },
    watch: {
        id: 'init',
    },
    methods: {
        init() {
            this.tips = '';
            this.comments = [];

            // 生成评论数据
            const query = new AV.Query('Comments');

            query.equalTo('type', 'comment');
            query.equalTo('parent_id', this.id);
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
            }).catch((error) => {
                console.error(error);
            });
        },
        save() {
            if (this.id === 0) return;
            if (!this.name || !this.comment) return this.message('昵称和评论必填哦😋');

            // 保存评论数据
            const comments = new AV.Object('Comments');

            comments.set('type', 'comment');
            comments.set('parent_id', this.id);
            comments.set('name', this.name);
            comments.set('email', this.email);
            comments.set('comment', this.comment);
            comments.set('ua', window.navigator.userAgent);
            comments.set('screen', `${window.screen.width},${window.screen.height}`);

            comments.save().then((comment) => {
                this.message('评论成功', comment);
                this.comment = '';
                this.comments.unshift({
                    name: comment.get('name'),
                    email: comment.get('email'),
                    comment: comment.get('comment'),
                    createdAt: dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                });
            }).catch((error) => {
                this.message('评论失败');
                console.error(error);
            });
        },
        message(tips = '') {
            this.tips = tips;
            setTimeout(() => {
                this.tips = '';
            }, 2000);
        },
    },
};
</script>

<style scoped>
ul,
li {
    margin: 0;
    padding: 0;
    list-style: none;
}

.comments-comment * {
    font-size: 14px;
    line-height: 22px;
    box-sizing: border-box;
    outline: none;
    resize: none;
    vertical-align: top;
}

.comments-comment {
    position: absolute;
    top: 100px;
    left: 300px;
    width: 300px;
    height: 400px;
    padding: 16px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, .16), 0 3px 6px 0 rgba(0, 0, 0, .12), 0 5px 12px 4px rgba(0, 0, 0, .09);
    box-sizing: border-box;
    user-select: text;
}

.comments-comment .comments {
    height: 244px;
    overflow: overlay;
}
.comments-comment .comments-nodata {
    height: 234px;
    color: rgba(0, 0, 0, .85);
    text-align: center;
}
.comments-comment .comments-nodata img {
    display: block;
    margin: 10px auto;
}

.comments-comment .comments-new {
    margin-top: 16px;
    border: 1px solid #1890ff;
    border-radius: 4px;
    overflow: hidden;
}

/* 评论列表 */
.comments-comment .comment {
    padding: 0 0 8px;
}

.comment-author {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-bottom: 4px;
}

.comment-author .avatar,
.comment-author .name,
.comment-author .time {
    padding-right: 8px;
}

.comment-author .avatar img {
    width: 22px;
    height: 22px;
    border-radius: 50%;
}
.comment-author .name {
    max-width: 120px;
    color: rgba(0, 0, 0, .45);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.comment-author .time {
    color: #ccc;
    font-size: 12px;
}

.comment-detail {
    color: rgba(0, 0, 0, .85);
}

.comment-detail p {
    margin: 0;
}

/* 添加评论 */
.new-header input {
    padding: 4px;
    color: rgba(0, 0, 0, .85);
    font-size: 12px;
    line-height: 20px;
    background: transparent;
    border: none;
}
.new-header input:nth-child(1) {
    width: 40%;
}
.new-header input:nth-child(2) {
    width: 60%;
}

.new-editer {
    padding: 4px;
    border-top: 1px dashed #1890ff;
}
.new-editer textarea {
    width: 100%;
    height: 40px;
    padding: 0;
    color: rgba(0, 0, 0, .85);
    font-size: 12px;
    line-height: 20px;
    background: transparent;
    border: none;
}

.new-footer {
    display: flex;
    justify-content: space-between;
    border-top: 1px dashed #1890ff;
}
.new-footer .tips,
.new-footer .submit {
    padding: 4px;
    color: #1890ff;
    font-size: 12px;
    line-height: 20px;
}
.new-footer .tips {
    color: #ff7875;
}
.new-footer .submit {
    background: transparent;
    border: none;
    cursor: pointer;
}
</style>
