---
title: Image 图片
description: 展示带加载和预览能力的图片。
---
# Image 图片

<a class="VPButton medium alt" href="https://reka-ui.com/docs/components/aspect-ratio" target="_blank" rel="noreferrer">reka-ui文档</a>

`UiImage` 用于展示图片，并支持预览与占位状态。

## 基础用法

<div class="vp-demo">
<UiImage src="/image.png" alt="示例图片" />
</div>

```vue
<UiImage src="/image.png" alt="示例图片" />
```

## 使用说明

始终提供有意义的 `alt`；需要固定比例时结合 `UiAspectRatio`。
