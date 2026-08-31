---
title: Dialog 对话框
description: 在当前页面上显示模态内容。
---
# Dialog 对话框

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/dialog" target="_blank" rel="noreferrer">shadcn-vue文档</a> <a class="VPButton medium alt" href="https://reka-ui.com/docs/components/dialog" target="_blank" rel="noreferrer">reka-ui文档</a>

`UiDialog` 在当前页面上展示模态内容。

## 基础用法

<div class="vp-demo">
<UiDialog><UiDialogTrigger>打开</UiDialogTrigger><UiDialogContent><UiDialogTitle>标题</UiDialogTitle>内容</UiDialogContent></UiDialog>
</div>

```vue
<UiDialog><UiDialogTrigger>打开</UiDialogTrigger><UiDialogContent><UiDialogTitle>标题</UiDialogTitle>内容</UiDialogContent></UiDialog>
```

## 组成

使用 `UiDialogHeader`、`UiDialogFooter`、`UiDialogDescription` 与 `UiDialogClose` 补充结构和关闭操作。
