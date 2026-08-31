---
title: Input 输入框
description: 接收单行、数值或对比条件输入。
---
# Input 输入框

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/input" target="_blank" rel="noreferrer">shadcn-vue文档</a>

`UiInput` 接收单行文本；另提供数值、对比和应用包装组件。

## 基础用法

<div class="vp-demo">
<UiInput placeholder="请输入" />
</div>

```vue
<UiInput v-model="value" placeholder="请输入" />
```

## 组成

`UiInputNumber` 用于数值输入，`UiInputCompare` 用于比较条件输入。
