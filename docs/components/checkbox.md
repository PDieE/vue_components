---
title: Checkbox 复选框
description: 选择一个或多个选项。
---
# Checkbox 复选框

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/checkbox" target="_blank" rel="noreferrer">shadcn-vue文档</a>
<a class="VPButton medium alt" href="https://reka-ui.com/docs/components/checkbox" target="_blank" rel="noreferrer">reka-ui文档</a>

`UiCheckbox` 用于选择一个或多个选项。

## 基础用法

<div class="vp-demo">
<UiCheckbox />
</div>

```vue
<UiCheckbox v-model="checked" />
```

## 复选框组

`UiCheckboxGroup` 绑定值数组，并通过 `options` 或默认插槽提供选项。
