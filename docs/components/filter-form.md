---
title: Filter Form 筛选表单
description: 用于列表和数据视图的条件筛选。
---
# Filter Form 筛选表单

`UiFilterForm` 用于列表和数据视图的条件筛选。

## 基础用法

<div class="vp-demo">
<UiFilterForm><UiFilterFormContent>...筛选控件...</UiFilterFormContent><UiFilterFormAction>查询</UiFilterFormAction></UiFilterForm>
</div>

```vue
<UiFilterForm><UiFilterFormContent>...筛选控件...</UiFilterFormContent><UiFilterFormAction>查询</UiFilterFormAction></UiFilterForm>
```

## 组成

使用 `UiFilterFormMore` 收纳低频条件，使用 `UiFilterFormTag` 与 `UiFilterFormTagContent` 展示已选筛选条件。
