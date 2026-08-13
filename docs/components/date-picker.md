---
title: Date Picker 日期选择
description: 选择单个日期。
---

# Date Picker 日期选择

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/date-picker" target="_blank" rel="noreferrer">shadcn-vue文档</a> <a class="VPButton medium alt" href="https://reka-ui.com/docs/components/date-picker" target="_blank" rel="noreferrer">reka-ui文档</a>

`UiDatePicker` 用于选择单个日期。

## 基础用法

<div class="vp-demo">
<UiDatePicker />
</div>

```vue
<UiDatePicker v-model="date" />
```

## 只读

`readonly` 会保留当前日期展示和正常视觉样式，鼠标显示为默认样式，且不可打开面板、选择日期或清空。

```vue
<template>
  <UiDatePicker v-model="date" readonly />
</template>
```

## 时间选择

`enableTimePicker` 传入 `true` 时可选择时、分、秒。也可以传入 `format` 控制精度：`HH` 仅选择小时，`HH:mm` 选择小时和分钟。

```vue
<template>
  <UiDatePicker v-model="dateTime" :enable-time-picker="true" />
  <UiDatePicker v-model="dateHour" :enable-time-picker="{ format: 'HH' }" />
  <UiDatePicker v-model="dateMinute" :enable-time-picker="{ format: 'HH:mm' }" />
</template>
```

未传 `valueFormat` 时，值格式会跟随时间格式，例如 `HH:mm` 输出 `YYYY-MM-DD HH:mm`。

## 禁用日期

`disableDate` 只影响日期选择，不会限制时间选择器。它支持指定日期数组、日期区间对象或回调函数。

```vue
<script setup lang="ts">
import dayjs from 'dayjs'

const disabledDates = ['2026-08-01', new Date('2026-08-15'), dayjs('2026-08-20')]

const disabledDateRange = {
  from: '2026-08-01',
  to: '2026-08-07',
  before: '2026-07-01',
  after: '2026-12-31',
}
</script>

<template>
  <UiDatePicker :disable-date="disabledDates" />
  <UiDatePicker :disable-date="disabledDateRange" />
  <UiDatePicker :disable-date="(date) => date.day() === 0" />
</template>
```

- `from` 和 `to`：必须同时传入，禁用两端日期在内的区间；单独传入时不生效。
- `before` 和 `after`：分别禁用指定日期之前、之后的日期，不包含指定日期。
