<template>
    <div class="comments-comment" :style="box">
        <ul class="comments">
            <li v-for="n in 5" :key="n">
                <div class="comment">
                    <div class="comment-author">
                        <span class="avatar">
                            <img src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" alt="">
                        </span>
                        <span class="name" title="这是一个很长的昵称">
                            这是一个很长的昵称
                        </span>
                        <span class="time" title="2020-12-04 11:27:04">
                            1年前
                        </span>
                    </div>
                    <div class="comment-detail">
                        <p>评论组件可用于对事物的讨论，例如页面、博客文章、问题等等。</p>
                    </div>
                </div>
            </li>
        </ul>
        <div class="comments-new" :style="borderColor">
            <div class="new-header">
                <input type="text" name="name" placeholder="昵称">
                <input type="email" name="email" placeholder="邮箱">
            </div>
            <div class="new-editer" :style="borderColor">
                <textarea name="comment" placeholder="还不来评论一下？😏"></textarea>
            </div>
            <div class="new-footer" :style="borderColor">
                <button type="button" :style="color">评论</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['pointColor'],
    computed: {
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
}

.comments-comment .comments {
    height: 244px;
    overflow: overlay;
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
    justify-content: flex-end;
    border-top: 1px dashed #1890ff;
}
.new-footer button {
    padding: 4px;
    color: #1890ff;
    font-size: 12px;
    line-height: 20px;
    background: transparent;
    border: none;
    cursor: pointer;
}
</style>
