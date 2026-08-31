---
title: Form 表单
description: 管理表单的禁用状态和字段内容。
---
# Form 表单

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/form" target="_blank" rel="noreferrer">shadcn-vue文档</a>

`UiForm` 为内部字段提供统一状态。

## 基础用法

<div class="vp-demo">
<UiForm>...</UiForm>
</div>

```vue
<UiForm :disabled="submitting">...</UiForm>
```

## 使用说明

提交期间传入 `disabled`；字段校验可配合 vee-validate。
