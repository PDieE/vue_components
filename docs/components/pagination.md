---
title: Pagination 分页
description: 在分页数据之间切换。
---
# Pagination 分页

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/pagination" target="_blank" rel="noreferrer">shadcn-vue文档</a> <a class="VPButton medium alt" href="https://reka-ui.com/docs/components/pagination" target="_blank" rel="noreferrer">reka-ui文档</a>

## 基础用法

<div class="vp-demo">
<UiPagination />
</div>

```vue
<UiPagination v-model:page="page" :total="100" :items-per-page="10" />
```

使用 `UiPaginationContent`、`UiPaginationItem`、`UiPaginationPrevious` 与 `UiPaginationNext` 自定义导航布局。
