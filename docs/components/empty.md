---
title: Empty 空状态
description: 在没有可展示内容时提供说明与操作。
---
# Empty 空状态

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/empty" target="_blank" rel="noreferrer">shadcn-vue文档</a>

`UiEmpty` 在没有可展示内容时提供说明与下一步操作。

## 基础用法

<div class="vp-demo">
<UiEmpty><UiEmptyHeader><UiEmptyTitle>暂无数据</UiEmptyTitle><UiEmptyDescription>请调整筛选条件后重试。</UiEmptyDescription></UiEmptyHeader></UiEmpty>
</div>

```vue
<UiEmpty><UiEmptyHeader><UiEmptyTitle>暂无数据</UiEmptyTitle><UiEmptyDescription>请调整筛选条件后重试。</UiEmptyDescription></UiEmptyHeader></UiEmpty>
```

## 组成

使用 `UiEmptyMedia` 放置图标，使用 `UiEmptyContent` 放置创建、刷新等操作。
