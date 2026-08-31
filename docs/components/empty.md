---
title: Empty 空状态
description: 在没有可展示内容时提供说明与操作。
---
# Empty 空状态

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/empty" target="_blank" rel="noreferrer">shadcn-vue文档</a>

空状态用于在没有可展示内容时提供说明与下一步操作。推荐优先使用 `UiEmptyApp`，它内置了默认插图、标题、描述与操作区域；需要完全自定义结构时，再组合使用底层 `UiEmpty` 组件。

## 推荐用法

<div class="vp-demo">
<UiEmptyApp title="暂无数据" description="请调整筛选条件后重试。" />
</div>

```vue
<UiEmptyApp title="暂无数据" description="请调整筛选条件后重试。" />
```

通过 `content` 插槽添加创建、刷新等操作：

<div class="vp-demo">
<UiEmptyApp title="暂无项目" description="创建第一个项目后，它会显示在这里。"><template #content><UiButton>创建项目</UiButton></template></UiEmptyApp>
</div>

```vue
<UiEmptyApp title="暂无项目" description="创建第一个项目后，它会显示在这里。">
  <template #content>
    <UiButton>创建项目</UiButton>
  </template>
</UiEmptyApp>
```

## 自定义内容

`UiEmptyApp` 支持替换默认插图、标题与描述。`media-variant` 可传入 `default`（默认）或 `icon`；使用图标作为媒体内容时建议选择 `icon`。

```vue
<script setup lang="ts">
import { FolderPlusIcon } from 'lucide-vue-next'
</script>

<template>
  <UiEmptyApp media-variant="icon">
    <template #media>
      <FolderPlusIcon />
    </template>
    <template #title>还没有文件夹</template>
    <template #description>新建文件夹以整理你的内容。</template>
    <template #content>
      <UiButton>新建文件夹</UiButton>
    </template>
  </UiEmptyApp>
</template>
```

## 底层组件组合

当 `UiEmptyApp` 的布局不满足需求时，可使用 `UiEmpty`、`UiEmptyHeader`、`UiEmptyMedia`、`UiEmptyTitle`、`UiEmptyDescription` 与 `UiEmptyContent` 自行组合。`UiEmptyMedia` 用于放置图标或插图，`UiEmptyContent` 用于放置操作。

```vue
<UiEmpty>
  <UiEmptyHeader>
    <UiEmptyTitle>暂无数据</UiEmptyTitle>
    <UiEmptyDescription>请调整筛选条件后重试。</UiEmptyDescription>
  </UiEmptyHeader>
</UiEmpty>
```

## API

### UiEmptyApp

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 标题文本。 |
| `description` | `string` | — | 描述文本。 |
| `media-variant` | `'default' \| 'icon'` | `'default'` | 媒体区域样式。 |
| `class` | `HTMLAttributes['class']` | — | 合并到空状态根元素的自定义类名。 |

| 插槽 | 说明 |
| --- | --- |
| `media` | 替换默认插图。 |
| `title` | 替换标题内容。 |
| `description` | 替换描述内容。 |
| `content` | 操作区域，例如按钮。 |
| 默认插槽 | 追加自定义内容。 |
