---
title: Command 命令菜单
description: 提供可筛选的命令与选项列表。
---
# Command 命令菜单

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/command" target="_blank" rel="noreferrer">shadcn-vue文档</a> <a class="VPButton medium alt" href="https://reka-ui.com/docs/components/listbox" target="_blank" rel="noreferrer">reka-ui文档</a>

`UiCommand` 用于可筛选的命令和选项列表。

## 基础用法

<div class="vp-demo">
<UiCommand><UiCommandInput placeholder="搜索..." /><UiCommandList><UiCommandItem value="edit">编辑</UiCommandItem></UiCommandList></UiCommand>
</div>

```vue
<UiCommand><UiCommandInput placeholder="搜索..." /><UiCommandList><UiCommandItem value="edit">编辑</UiCommandItem></UiCommandList></UiCommand>
```

## 组成

可使用 `UiCommandGroup`、`UiCommandEmpty`、`UiCommandSeparator` 与 `UiCommandDialog` 组织命令面板。
