---
title: Collapsible 折叠面板
description: 展开或隐藏可选内容。
---
# Collapsible 折叠面板

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/collapsible" target="_blank" rel="noreferrer">shadcn-vue文档</a> <a class="VPButton medium alt" href="https://reka-ui.com/docs/components/collapsible" target="_blank" rel="noreferrer">reka-ui文档</a>

`UiCollapsible` 控制内容区域的展开与收起。

## 基础用法

<div class="vp-demo">
<UiCollapsible><UiCollapsibleTrigger>展开</UiCollapsibleTrigger><UiCollapsibleContent>内容</UiCollapsibleContent></UiCollapsible>
</div>

```vue
<UiCollapsible v-model:open="open"><UiCollapsibleTrigger>展开</UiCollapsibleTrigger><UiCollapsibleContent>内容</UiCollapsibleContent></UiCollapsible>
```

## API

`v-model:open` 可受控管理状态；使用 Trigger 和 Content 组合触发器与内容。
