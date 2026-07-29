---
title: Sheet 侧边面板
description: 从屏幕边缘滑出的面板。
---
# Sheet 侧边面板

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/sheet" target="_blank" rel="noreferrer">shadcn-vue文档</a>

<a class="VPButton medium alt" href="https://reka-ui.com/docs/components/dialog" target="_blank" rel="noreferrer">reka-ui文档</a>

复用 Dialog 的可访问性行为，适合承载详情、表单和导航。

## 基础用法

<div class="vp-demo">
<UiSheet><UiSheetTrigger>打开</UiSheetTrigger><UiSheetContent>内容</UiSheetContent></UiSheet>
</div>

```vue
<UiSheet><UiSheetTrigger>打开</UiSheetTrigger><UiSheetContent>内容</UiSheetContent></UiSheet>
```

## 组件组成

UiSheet、UiSheetTrigger、UiSheetContent、UiSheetHeader、UiSheetFooter、UiSheetTitle。

## 使用说明

请结合实际业务状态通过 `v-model`、属性和事件进行控制。
