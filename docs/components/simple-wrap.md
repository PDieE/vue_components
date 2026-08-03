---
title: Simple Wrap 状态包装器
description: 统一处理内容的加载、空、错误与正常状态。
---

<script setup lang="ts">
import { ref } from 'vue'

const state = ref<'content' | 'loading' | 'empty' | 'error'>('content')

function retry() {
  state.value = 'loading'
  window.setTimeout(() => {
    state.value = 'content'
  }, 600)
}
</script>

# Simple Wrap 状态包装器

`UiSimpleWrap` 根据状态在正常内容、加载、空状态和错误状态之间切换。空状态与错误状态基于 `UiEmptyApp` 渲染，因此可以传入标题、描述、媒体样式和自定义类名，也支持完整替换各个区域。

## 基础用法

通过 `loading`、`empty` 和 `error` 控制显示状态；未设置任何状态时渲染默认插槽。状态优先级从高到低依次是：`loading`、`error`、`empty`、正常内容。

<div class="flex flex-wrap gap-2 not-content">
  <UiButton size="sm" @click="state = 'content'">正常内容</UiButton>
  <UiButton size="sm" @click="state = 'loading'">加载</UiButton>
  <UiButton size="sm" @click="state = 'empty'">空状态</UiButton>
  <UiButton size="sm" @click="state = 'error'">错误</UiButton>
</div>

<div class="vp-demo">
<UiSimpleWrap :loading="state === 'loading'" :empty="state === 'empty'" :error="state === 'error'" @retry="retry">
  已加载的内容
</UiSimpleWrap>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const empty = ref(false)
const error = ref(false)

function retry() {
  // 重新请求数据
}
</script>

<template>
  <UiSimpleWrap :loading="loading" :empty="empty" :error="error" @retry="retry">
    已加载的内容
  </UiSimpleWrap>
</template>
```

## 空状态与错误状态

`empty` 和 `error` 可传入 `true`，也可传入 `UiEmptyApp` 的属性对象。空状态默认描述为“暂无数据”；错误状态默认描述为“数据获取失败”，并在 `content` 区域提供“重试”按钮。

<div class="vp-demo">
<UiSimpleWrap :error="{ title: '订单加载失败', description: '请检查网络后重试。', mediaVariant: 'icon' }" @retry="retry" />
</div>

```vue
<template>
  <UiSimpleWrap
    :empty="{
      title: '暂无订单',
      description: '完成下单后，订单会显示在这里。',
    }"
  >
    订单列表
  </UiSimpleWrap>

  <UiSimpleWrap
    :error="{
      title: '订单加载失败',
      description: '请检查网络后重试。',
      mediaVariant: 'icon',
    }"
    @retry="fetchOrders"
  />
</template>
```

设置 `type="card"` 时，加载、空和错误状态会包裹在 `UiCard` 中；正常内容保持原样，不会自动添加卡片。

## 自定义状态内容

可用 `empty*` 和 `error*` 具名插槽替换相应状态的媒体、标题、描述、操作区域或追加内容。`errorAfter` 与 `emptyAfter` 会渲染在空状态组件的末尾。

```vue
<template>
  <UiSimpleWrap :empty="true">
    <template #emptyMedia>
      <img src="/illustrations/search.svg" alt="" />
    </template>
    <template #emptyTitle>没有匹配结果</template>
    <template #emptyDescription>试试调整搜索关键词。</template>
    <template #emptyContent>
      <UiButton variant="outline">清除筛选</UiButton>
    </template>
    <template #emptyAfter>
      <a href="/help">查看帮助</a>
    </template>
  </UiSimpleWrap>
</template>
```

## 独立使用状态组件

`UiSimpleWrapEmpty` 和 `UiSimpleWrapError` 也可单独使用，属性和插槽均与 `UiEmptyApp` 一致。`UiSimpleWrapError` 额外提供 `retry` 事件，默认操作为触发该事件的“重试”按钮。

```vue
<template>
  <UiSimpleWrapEmpty title="暂无消息" description="新消息会显示在这里。" />

  <UiSimpleWrapError
    title="消息加载失败"
    description="请稍后重试。"
    @retry="fetchMessages"
  >
    <template #content>
      <UiButton @click="fetchMessages">重新加载</UiButton>
    </template>
  </UiSimpleWrapError>
</template>
```

## API

### UiSimpleWrap

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'default' \| 'card'` | `'default'` | 状态内容的容器类型。 |
| `loading` | `boolean` | `false` | 是否显示加载状态，优先级最高。 |
| `loading-class` | `string` | — | 加载状态容器的自定义类名。 |
| `error` | `boolean \| EmptyAppProps` | `false` | 是否显示错误状态，或传入错误状态的配置。 |
| `empty` | `boolean \| EmptyAppProps` | `false` | 是否显示空状态，或传入空状态的配置。 |

| 事件 | 说明 |
| --- | --- |
| `retry` | 错误状态默认“重试”按钮被点击时触发。 |

| 插槽 | 说明 |
| --- | --- |
| `default` | 正常内容。 |
| `errorMedia` / `emptyMedia` | 替换错误/空状态的媒体区域。 |
| `errorTitle` / `emptyTitle` | 替换错误/空状态的标题。 |
| `errorDescription` / `emptyDescription` | 替换错误/空状态的描述。 |
| `errorContent` / `emptyContent` | 替换错误/空状态的操作区域。 |
| `errorAfter` / `emptyAfter` | 在错误/空状态内容后追加内容。 |

### UiSimpleWrapEmpty 与 UiSimpleWrapError

两者均支持以下属性与插槽：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 标题文本。 |
| `description` | `string` | 空状态：`'暂无数据'`；错误状态：`'数据获取失败'` | 描述文本。 |
| `media-variant` | `'default' \| 'icon'` | `'default'` | 媒体区域样式。 |
| `class` | `HTMLAttributes['class']` | — | 合并到状态根元素的自定义类名。 |

| 插槽 | 说明 |
| --- | --- |
| `media` | 替换默认插图。 |
| `title` | 替换标题内容。 |
| `description` | 替换描述内容。 |
| `content` | 操作区域；错误状态默认显示重试按钮。 |
| `default` | 在状态内容末尾追加自定义内容。 |

`UiSimpleWrapError` 还会在默认重试按钮被点击时触发 `retry` 事件。
