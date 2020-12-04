# 双击评论

## 参数

| 参数 | 类型 | 可选值 | 默认值 | 说明 |
|:---|:---|:---|:---|:---|
| api | string | - | - | 接口地址，和 appId,appKey 二选一，优先于 appId,appKey |
| appId | string | - | - | LeanCloud AppId |
| appKey | string | - | - | LeanCloud AppKey |
| appUrl | string | - | - | LeanCloud 绑定域名 |
| origin | string | left/center | center | 坐标点原点，`left: [0, 0]` `center: [window.innerWidth / 2, 0]` |
| pointSize | string | large/default/small | default | 坐标点尺寸 |
| pointColor | string/array | random<br />red/volcano/orange<br />gold/yellow/lime<br />green/cyan/blue<br />geekblue/purple/magenta | random | 坐标点颜色 |
| zIndex | number | - | 999 | 坐标点层级 |
| delay | number | - | 0.1 | 评论框关闭延时，单位：秒 |

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
