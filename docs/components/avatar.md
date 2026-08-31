---
title: Avatar 头像
description: 展示用户或实体的头像。
---
# Avatar 头像

<a class="VPButton medium alt" href="https://shadcn-vue.com/docs/components/avatar" target="_blank" rel="noreferrer">shadcn-vue文档</a>
<a class="VPButton medium alt" href="https://reka-ui.com/docs/components/avatar" target="_blank" rel="noreferrer">reka-ui文档</a>

`UiAvatar` 显示用户头像，并在图片不可用时展示后备内容。

## 基础用法

<div class="vp-demo">
<UiAvatar><UiAvatarImage src="/avatar.png" alt="张三" /><UiAvatarFallback>张</UiAvatarFallback></UiAvatar>
</div>

```vue
<UiAvatar><UiAvatarImage src="/avatar.png" alt="张三" /><UiAvatarFallback>张</UiAvatarFallback></UiAvatar>
```

## 组成与 API

使用 `UiAvatarImage` 设置图片，`UiAvatarFallback` 设置加载失败或未提供图片时的内容。
