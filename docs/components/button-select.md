---
title: Button Select 按钮选择器
description: 以按钮方式呈现选项。
---
# Button Select 按钮选择器

`UiButtonSelect` 使用一组按钮承载选项选择。

## 基础用法

<div class="vp-demo">
<UiButtonSelect />
</div>

```vue
<UiButtonSelect v-model="value" :options="options" />
```

## 使用说明

选项应提供稳定的值；通过 `v-model` 获取当前选中项。
