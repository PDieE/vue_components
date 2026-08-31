---
title: Native Select 原生选择器
description: 原生 select 元素的统一样式封装。
---
# Native Select 原生选择器

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/native-select" target="_blank" rel="noreferrer">shadcn-vue文档</a> <a class="VPButton medium alt" href="https://reka-ui.com/docs/components/select" target="_blank" rel="noreferrer">reka-ui文档</a>

`UiNativeSelect` 保留浏览器原生选择体验并提供统一样式。

## 基础用法

<div class="vp-demo">
<UiNativeSelect><UiNativeSelectOption value="a">选项 A</UiNativeSelectOption></UiNativeSelect>
</div>

```vue
<UiNativeSelect v-model="value"><UiNativeSelectOption value="a">选项 A</UiNativeSelectOption></UiNativeSelect>
```
