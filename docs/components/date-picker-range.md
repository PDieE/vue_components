---
title: Date Picker Range 日期范围选择
description: 选择起止日期范围。
---

# Date Picker Range 日期范围选择

<a class="VPButton medium alt" href="https://reka-ui.com/docs/components/date-range-picker" target="_blank" rel="noreferrer">reka-ui文档</a>

`UiDatePickerRange` 用于选择起止日期范围。

## 基础用法

<div class="vp-demo">
<UiDatePickerRange />
</div>

```vue
<UiDatePickerRange v-model="range" />
```

## 只读

`readonly` 会保留当前日期范围展示和正常视觉样式，鼠标显示为默认样式，且不可打开面板、选择日期或清空。

```vue
<template>
  <UiDatePickerRange v-model="range" readonly />
</template>
```

## API

### UiDatePickerRange

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `readonly` | `boolean` | `false` | 是否只读；只读时不可打开面板、选择日期或清空，且不使用禁用样式。 |
