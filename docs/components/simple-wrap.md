---
title: Simple Wrap 状态包装器
description: 统一处理加载、空和错误状态。
---
# Simple Wrap 状态包装器

为异步内容提供加载中、无数据、错误和正常内容的切换。

## 基础用法

<div class="vp-demo">
<UiSimpleWrap>内容</UiSimpleWrap>
</div>

```vue
<UiSimpleWrap :loading="loading" :error="error">内容</UiSimpleWrap>
```

## 组件组成

UiSimpleWrap、UiSimpleWrapEmpty、UiSimpleWrapError。

## 使用说明

请结合实际业务状态通过 `v-model`、属性和事件进行控制。
