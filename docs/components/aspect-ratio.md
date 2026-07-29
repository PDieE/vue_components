---
title: Aspect Ratio 宽高比
description: 固定内容区域的显示比例。
---
# Aspect Ratio 宽高比

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/aspect-ratio" target="_blank" rel="noreferrer">shadcn-vue文档</a>
<a class="VPButton medium alt" href="https://reka-ui.com/docs/components/aspect-ratio" target="_blank" rel="noreferrer">reka-ui文档</a>

`UiAspectRatio` 固定图片、视频等内容的显示比例。

## 基础用法

<div class="vp-demo">
<UiAspectRatio><div class="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">16:9 内容区域</div></UiAspectRatio>
</div>

```vue
<UiAspectRatio :ratio="16 / 9"><img src="/cover.png" alt="封面" /></UiAspectRatio>
```

## API

`ratio` 为宽高比，默认插槽放置需要保持比例的内容。
