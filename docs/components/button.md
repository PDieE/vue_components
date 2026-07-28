---
title: UiButton
description: 用于触发操作的按钮组件。
---

# UiButton

`UiButton` 用于触发用户操作，支持不同的视觉样式、尺寸、主题、加载状态，以及以块级按钮展示。

## 基础用法

```vue
<script setup lang="ts">
import { Button as UiButton } from '@/components/ui/button'
</script>

<template>
  <UiButton>确认</UiButton>
</template>
```

## 样式

通过 `variant` 设置按钮样式。默认值为 `default`。

```vue
<template>
  <div class="flex flex-wrap gap-2">
    <UiButton variant="default">默认按钮</UiButton>
    <UiButton variant="secondary">次要按钮</UiButton>
    <UiButton variant="outline">描边按钮</UiButton>
    <UiButton variant="ghost">幽灵按钮</UiButton>
    <UiButton variant="text">文字按钮</UiButton>
    <UiButton variant="link">链接按钮</UiButton>
  </div>
</template>
```

## 主题

通过 `theme` 切换语义主题。默认主题为 `default`。

```vue
<template>
  <div class="flex flex-wrap gap-2">
    <UiButton theme="default">默认</UiButton>
    <UiButton theme="brand">品牌</UiButton>
    <UiButton theme="destructive">危险操作</UiButton>
  </div>
</template>
```

`theme="destructive"` 适合删除、清空等不可逆或高风险操作。

## 尺寸

通过 `size` 调整按钮大小。图标按钮应使用 `icon` 系列尺寸，并仅传入图标内容。

```vue
<script setup lang="ts">
import { PlusIcon } from '@lucide/vue'
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <UiButton size="xs">极小</UiButton>
    <UiButton size="sm">小</UiButton>
    <UiButton>默认</UiButton>
    <UiButton size="lg">大</UiButton>
    <UiButton size="icon" aria-label="新增">
      <PlusIcon />
    </UiButton>
  </div>
</template>
```

可用值：`xs`、`sm`、`default`、`lg`、`icon`、`icon-xs`、`icon-sm`、`icon-lg`。

## 图标

使用默认插槽放置任意图标；如果图标需要固定在文字前方，也可以使用 `icon` 具名插槽。

```vue
<script setup lang="ts">
import { DownloadIcon } from '@lucide/vue'
</script>

<template>
  <UiButton>
    <template #icon>
      <DownloadIcon />
    </template>
    下载
  </UiButton>
</template>
```

## 加载与禁用

`loading` 为 `true` 时，按钮会显示内置的 `UiSpinner`，并自动禁用；`disabled` 可单独控制禁用状态。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const submitting = ref(false)
</script>

<template>
  <UiButton :loading="submitting" @click="submitting = true">
    提交
  </UiButton>
  <UiButton disabled>不可用</UiButton>
</template>
```

> 加载中时，按钮默认插槽和 `icon` 插槽不会渲染，只显示加载指示器。

## 块级按钮

设置 `block` 使按钮占满父容器宽度。

```vue
<template>
  <UiButton block>保存</UiButton>
</template>
```

## 自定义渲染元素

组件继承 Reka UI 的 `Primitive` 属性，可通过 `as` 渲染为其他 HTML 元素，或用 `as-child` 将行为和样式合并到子元素。

```vue
<template>
  <UiButton as="a" href="/guide/getting-started">
    开始使用
  </UiButton>

  <UiButton as-child>
    <a href="/guide/getting-started">开始使用</a>
  </UiButton>
</template>
```

更多 `as` 与 `as-child` 的使用约定请参阅 [Reka UI Primitive 文档](https://reka-ui.com/docs/utilities/primitive)。

## API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'secondary' \| 'outline' \| 'ghost' \| 'text' \| 'link'` | `'default'` | 按钮视觉样式。 |
| `theme` | `'default' \| 'brand' \| 'destructive'` | `'default'` | 按钮语义主题。 |
| `size` | `'xs' \| 'sm' \| 'default' \| 'lg' \| 'icon' \| 'icon-xs' \| 'icon-sm' \| 'icon-lg'` | `'default'` | 按钮尺寸。 |
| `loading` | `boolean` | `false` | 显示加载指示器并禁用按钮。 |
| `disabled` | `boolean` | `false` | 是否禁用按钮。 |
| `block` | `boolean` | `false` | 是否占满父容器宽度。 |
| `class` | `HTMLAttributes['class']` | — | 合并到组件根元素的自定义类名。 |
| `as` | `PrimitiveProps['as']` | `'button'` | 根元素类型。 |
| `as-child` | `boolean` | `false` | 将属性和样式合并到唯一子元素。 |

## 插槽

| 名称 | 说明 |
| --- | --- |
| `default` | 按钮文本或自定义内容。 |
| `icon` | 非加载状态下显示在默认插槽前的图标。 |
