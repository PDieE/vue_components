---
title: Combobox 组合框
description: 支持搜索的选项选择器。
---

<script setup lang="ts">
import { ref } from 'vue'

const readonlyValue = ref('hangzhou')

const readonlyOptions = [
  { value: 'hangzhou', label: '杭州' },
  { value: 'ningbo', label: '宁波' },
]
</script>

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

## 只读

`readonly` 适用于需要展示已选值、但不允许用户修改的场景。它不会采用 `disabled` 样式，鼠标显示为默认样式，且不可打开面板、选择或清空。

<div class="vp-demo">
<UiCombobox v-model="readonlyValue" :options="readonlyOptions" readonly class="w-36" />
</div>

```vue
<template>
  <UiCombobox v-model="value" :options="options" readonly />
</template>
```

## API

### UiCombobox

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `readonly` | `boolean` | `false` | 是否只读；只读时不可打开下拉面板、选择或清空，且不使用禁用样式。 |
