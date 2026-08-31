---
title: Radio Group 单选组
description: 从多个互斥选项中选择一项。
---
# Radio Group 单选组

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/radio-group" target="_blank" rel="noreferrer">shadcn-vue文档</a>

<a class="VPButton medium alt" href="https://reka-ui.com/docs/components/radio-group" target="_blank" rel="noreferrer">reka-ui文档</a>

在一组 RadioGroupItem 中使用 v-model 管理选中值。

## 基础用法

<div class="vp-demo">
<UiRadioGroup><UiRadioGroupItem value="a" /></UiRadioGroup>
</div>

```vue
<UiRadioGroup v-model="value"><UiRadioGroupItem value="a" /></UiRadioGroup>
```

## 组件组成

UiRadioGroup、UiRadioGroupItem。

## 使用说明

请结合实际业务状态通过 `v-model`、属性和事件进行控制。
