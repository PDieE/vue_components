---
title: Calendar 日历
description: 展示并选择日期。
---
# Calendar 日历

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/calendar" target="_blank" rel="noreferrer">shadcn-vue文档</a>
<a class="VPButton medium alt" href="https://reka-ui.com/docs/components/calendar" target="_blank" rel="noreferrer">reka-ui文档</a>

`UiCalendar` 提供单日期选择的完整日历视图。

## 基础用法

<div class="vp-demo">
<UiCalendar />
</div>

```vue
<UiCalendar v-model="date" />
```

## API

使用 Reka UI 的 `DateValue` 作为日期值。可按需组合 `UiCalendarHeader`、`UiCalendarGrid` 与导航按钮自定义布局。
