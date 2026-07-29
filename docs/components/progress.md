---
title: Progress 进度条
description: 展示任务完成进度。
---
# Progress 进度条

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/progress" target="_blank" rel="noreferrer">shadcn-vue文档</a> <a class="VPButton medium alt" href="https://reka-ui.com/docs/components/progress" target="_blank" rel="noreferrer">reka-ui文档</a>

`UiProgress` 表示具有明确完成比例的任务。

## 基础用法

<div class="vp-demo">
<UiProgress />
</div>

```vue
<UiProgress :model-value="60" />
```

`model-value` 传入 0–100 的进度值；未知进度使用 Spinner。
