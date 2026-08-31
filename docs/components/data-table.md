---
title: Data Table 数据表格
description: 基于 TanStack Table 的数据表格。
---
# Data Table 数据表格

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/data-table" target="_blank" rel="noreferrer">shadcn-vue文档</a>

`UiDataTable` 基于 TanStack Table 展示数据。

## 基础用法

<div class="vp-demo">
<UiDataTable />
</div>

```vue
<UiDataTable :columns="columns" :data="data" />
```

## 使用说明

`columns` 使用 `DataTableColumn` 定义；列可配置 `fixed`、`ellipsis`、`visible` 与 `selectOptions`。
