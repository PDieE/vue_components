---
title: Spinner 加载器
description: 用于表示内容正在加载的旋转指示器。
---

# Spinner 加载器

`UiSpinner` 是一个基于 `Loader2Icon` 的加载指示器。组件内置旋转动画，并带有 `role="status"` 与 `aria-label="Loading"`，可直接用于按钮、局部内容或页面加载状态。

## 基础用法

<UiSpinner />

```vue
<template>
  <UiSpinner />
</template>
```

## 自定义尺寸和颜色

通过 `class` 传入 Tailwind CSS 类名以调整外观。组件默认尺寸为 `size-4`。

<div class="flex items-center gap-3">
  <UiSpinner class="size-3" />
  <UiSpinner class="size-5 text-brand" />
  <UiSpinner class="size-8 text-destructive" />
</div>

```vue
<template>
  <div class="flex items-center gap-3">
    <UiSpinner class="size-3" />
    <UiSpinner class="size-5 text-brand" />
    <UiSpinner class="size-8 text-destructive" />
  </div>
</template>
```

传入的类名会与组件的默认 `size-4 animate-spin` 合并；尺寸类可覆盖默认尺寸，旋转动画仍会保留。

## 与按钮配合

通常无需手动在按钮中放置加载器。`UiButton` 的 `loading` 属性会自动显示 `UiSpinner` 并禁用按钮。

<UiButton loading>保存中</UiButton>

```vue
<template>
  <UiButton loading>保存中</UiButton>
</template>
```

## API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `class` | `HTMLAttributes['class']` | — | 合并到图标根元素的自定义类名，可用于设置尺寸、颜色等。 |
