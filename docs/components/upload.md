---
title: Upload Image 图片上传
description: 上传和预览图片。
---
# Upload Image 图片上传

`UiUploadImage` 用于上传和预览图片，支持进度状态和图片尺寸校验。

## 基础用法

<div class="vp-demo">
<UiUploadImage />
</div>

```vue
<UiUploadImage v-model="files" />
```

## 只读

`readonly` 会保留已上传图片和预览能力，但不可选择、上传、重试或删除图片；组件保持正常视觉样式并使用默认鼠标样式。

```vue
<UiUploadImage v-model="files" readonly />
```

## API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `readonly` | `boolean` | `false` | 是否只读；只读时不可选择、上传、重试或删除图片，但仍可预览。 |
