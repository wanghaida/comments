# 双击评论

## 安装

```bash
npm install @uquuu/comments
```

```bash
yarn add @uquuu/comments
```

## 文档

[中文]() | [English]()

## 流程图

![](http://assets.processon.com/chart_image/5fc5bf5a7d9c082f44848884.png)

## 数据库

这里简单的设计了一张数据表，可以作为后台设计参考。

| 字段名 | 类型 | 长度 | 必填 | 其他 | 说明 |
|:---|:---|:---|:---|:---|:---|
| id | varchar | 255 | 是 | 主键、唯一 |  |
| type | varchar | 255 | 是 |  | 类型，`point` `comment` |
| path | varchar | 1000 |  |  | 网页路径 |
| origin | varchar | 255 |  |  | 坐标点原点 |
| points | varchar | 255 |  |  | 坐标点，英文逗号分隔 |
| parent_id | varchar | 255 |  |  | 父 ID |
| name | varchar | 255 |  |  | 昵称 |
| email | varchar | 1000 |  |  | 邮箱 |
| comment | longtext |  |  |  | 评论内容 |
| ip | varchar | 255 |  |  | IP |
| ua | varchar | 255 |  |  | UA |
| screen | varchar | 255 |  |  | 屏幕尺寸 |
| created_at | timestamp |  |  |  | 创建时间 |
| updated_at | timestamp |  |  |  | 更新时间 |
