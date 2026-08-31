---
title: Stepper 步骤条
description: 展示多步骤流程的当前位置。
---
# Stepper 步骤条

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/stepper" target="_blank" rel="noreferrer">shadcn-vue文档</a>

<a class="VPButton medium alt" href="https://reka-ui.com/docs/components/stepper" target="_blank" rel="noreferrer">reka-ui文档</a>

可组合步骤项、触发器、指示器、标题、说明和分隔符。

## 基础用法

<div class="vp-demo">
<UiStepper>...</UiStepper>
</div>

```vue
<UiStepper v-model="step">...</UiStepper>
```

## 组件组成

UiStepper、UiStepperItem、UiStepperTrigger、UiStepperIndicator。

## 使用说明

请结合实际业务状态通过 `v-model`、属性和事件进行控制。
