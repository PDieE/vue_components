---
title: Upload Dragger 拖拽上传
description: 通过点击或拖拽上传文件。
---

# Upload Dragger 拖拽上传

`UiUploadDragger` 支持点击选择或拖拽文件上传，并展示上传进度和文件状态。

## 基础用法

<div class="vp-demo">
<UiUploadDragger />
</div>

```vue
<UiUploadDragger v-model="files" />
```

## 只读

`readonly` 会保留文件列表和下载能力，但不可选择、拖拽、上传、重试或删除文件；组件保持正常视觉样式并使用默认鼠标样式。

```vue
<UiUploadDragger v-model="files" readonly />
```

## API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `readonly` | `boolean` | `false` | 是否只读；只读时不可选择、拖拽、上传、重试或删除文件。 |
