---
title: 快速开始
description: 安装依赖并在 Vue 项目中使用组件。
---

# 快速开始

本组件库使用 Tailwind CSS 管理样式，并遵循 shadcn-vue 的项目结构和设计约定。开始使用前，请先完成以下基础配置。

## 1. 安装 Tailwind CSS

组件的样式依赖 Tailwind CSS。请先按照 [Tailwind CSS 的 Vite 安装指南](https://tailwindcss.com/docs/installation/using-vite) 在项目中安装并配置 Tailwind CSS。

如果项目使用 Vite，Tailwind CSS 4 的基础依赖如下：

```bash
pnpm add tailwindcss @tailwindcss/vite
```

完成安装后，确保全局样式文件中包含：

```css
@import 'tailwindcss';
```

## 2. 初始化 shadcn-vue

接着请按照 [shadcn-vue 的 Vite 初始化文档](https://v3.shadcn-vue.com/docs/installation/vite) 完成初始化。该流程会配置路径别名、`components.json` 和组件所需的样式基础。

```bash
pnpm dlx shadcn-vue@latest init
```

> 本项目的组件使用 Reka UI Primitive；shadcn-vue 初始化时请选择与项目技术栈相符的 Vite 和 Tailwind CSS 4 配置。

## 3. 配置自动导入（推荐）

为了在模板中直接使用 `UiButton`、`UiSpinner` 等组件，推荐使用 [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) 自动导入。

先安装插件：

```bash
pnpm add -D unplugin-vue-components
```

然后在 `vite.config.ts` 中添加 `Components`。以下配置会按目录生成命名空间，并折叠重复前缀：例如 `src/components/ui/button/Button.vue` 可直接以 `UiButton` 使用。

```ts
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    Components({
      directoryAsNamespace: true,
      collapseSamePrefixes: true,
    }),
  ],
})
```

如果已有 Vite 插件，请将 `Components(...)` 追加到现有的 `plugins` 数组中：

```ts
plugins: [vue(), tailwindcss(), Components({
  directoryAsNamespace: true,
  collapseSamePrefixes: true,
})]
```

## 4. 使用组件

配置自动导入后，无需在每个 Vue 文件手动导入组件：

```vue
<template>
  <UiButton theme="brand">保存</UiButton>
</template>
```

不使用自动导入时，则从组件目录手动导入：

```vue
<script setup lang="ts">
import { Button as UiButton } from '@/components/ui/button'
</script>

<template>
  <UiButton theme="brand">保存</UiButton>
</template>
```
