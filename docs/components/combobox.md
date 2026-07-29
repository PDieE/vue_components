---
title: Combobox 组合框
description: 支持搜索的选项选择器。
---
# Combobox 组合框

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/combobox" target="_blank" rel="noreferrer">shadcn-vue文档</a> <a class="VPButton medium alt" href="https://reka-ui.com/docs/components/combobox" target="_blank" rel="noreferrer">reka-ui文档</a>

`UiCombobox` 从本地或异步选项中搜索并选择值。

## 基础用法

<div class="vp-demo">
<UiCombobox />
</div>

```vue
<UiCombobox v-model="value" :options="options" />
```

## 级联选择

使用 `UiComboboxCascader` 渲染带 `children` 的层级选项；选项的 `value` 应保持稳定。
