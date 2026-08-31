---
title: Map Select 地图选择
description: 通过地图和搜索选择地理位置。
---
# Map Select 地图选择

`UiMapSelect` 基于高德地图服务搜索并选择位置。

## 基础用法

<div class="vp-demo">
<UiMapSelect />
</div>

```vue
<UiMapSelect v-model="location" />
```

## 使用说明

使用前配置高德地图密钥；根据业务需要保存坐标、地址和行政区信息。
