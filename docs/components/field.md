---
title: Field 表单字段
description: 为表单控件提供一致的布局与说明。
---
# Field 表单字段

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/field" target="_blank" rel="noreferrer">shadcn-vue文档</a>

`UiField` 为表单控件提供一致的标签、说明和错误布局。

## 基础用法

<div class="vp-demo">
<UiField><UiFieldLabel>名称</UiFieldLabel><UiInput /><UiFieldDescription>请输入展示名称。</UiFieldDescription></UiField>
</div>

```vue
<UiField><UiFieldLabel>名称</UiFieldLabel><UiInput /><UiFieldDescription>请输入展示名称。</UiFieldDescription></UiField>
```

## API

`orientation` 支持 `vertical`、`horizontal`、`responsive`；错误信息使用 `UiFieldError`。
