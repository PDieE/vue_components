---
title: Tree 树形结构
description: 展示可展开的层级数据。
---
# Tree 树形结构

<a class="VPButton medium alt" href="https://reka-ui.com/docs/components/tree" target="_blank" rel="noreferrer">reka-ui文档</a>

适合文件、组织和分类等递归层级数据，并支持虚拟列表。

## 基础用法

<div class="vp-demo">
<UiTree />
</div>

```vue
<UiTree :items="items" />
```

## 组件组成

UiTree、UiTreeRoot、UiTreeItem、UiTreeVirtualizer。

## 使用说明

请结合实际业务状态通过 `v-model`、属性和事件进行控制。
