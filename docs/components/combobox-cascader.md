---
title: Combobox Cascader 级联选择器
description: 支持层级选项的级联选择器。
---

<script setup lang="ts">
import { ref } from 'vue'

const readonlyValue = ref('xihu')
const readonlyOptions = [
  {
    value: 'hangzhou',
    label: '杭州',
    children: [
      { value: 'xihu', label: '西湖区' },
      { value: 'yuhang', label: '余杭区' },
    ],
  },
]
</script>

# Combobox Cascader 级联选择器

<a class="VPButton medium alt" href="https://reka-ui.com/docs/components/combobox" target="_blank" rel="noreferrer">reka-ui文档</a>

`UiComboboxCascader` 用于从带 `children` 的层级选项中选择值；选项的 `value` 应保持稳定。

## 基础用法

<div class="vp-demo">
<UiComboboxCascader />
</div>

```vue
<UiComboboxCascader v-model="value" :options="options" />
```

## 只读

`readonly` 适用于需要展示已选值、但不允许用户修改的场景。它不会采用 `disabled` 样式，鼠标显示为默认样式，且不可打开面板、选择或清空。

<div class="vp-demo">
<UiComboboxCascader v-model="readonlyValue" :options="readonlyOptions" readonly class="w-44" />
</div>

```vue
<template>
  <UiComboboxCascader v-model="value" :options="options" readonly />
</template>
```

## API

### UiComboboxCascader

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `readonly` | `boolean` | `false` | 是否只读；只读时不可打开下拉面板、选择或清空，且不使用禁用样式。 |
