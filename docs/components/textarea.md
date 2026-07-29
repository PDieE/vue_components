---
title: Textarea 文本域
description: 接收多行文本内容。
---
# Textarea 文本域

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/textarea" target="_blank" rel="noreferrer">shadcn-vue文档</a>

支持基础多行输入与应用包装组件。

## 基础用法

<div class="vp-demo">
<UiTextarea placeholder="请输入内容" />
</div>

```vue
<UiTextarea v-model="content" placeholder="请输入内容" />
```

## 组件组成

UiTextarea、UiTextareaApp。

## 使用说明

请结合实际业务状态通过 `v-model`、属性和事件进行控制。
