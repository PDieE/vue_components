# 2026-11-18

### 🚀 Features

- feat: [Components]`UiCombobox`新增`footer`插槽
- feat: [Components]`UiDescription`间隔缩小
- feat: [Components]`UiImageViewer`新增视频支持
- feat: [Components]`UiUploadDragger`新增`showDraggerAfterSelect`参数用于控制是否在选择文件后显示拖拽区域
- feat: [Components]`UiUploadImage`新增视频支持；当count为1时可以点击重新上传

### 🐞 Bug Fixes

### 🚧 Others

- chore: [Deps]引入`photoswipe-video-plugin`(1.0.2)用于视频预览支持

# 2026-11-13

### 🚀 Features

- feat: [Components]新增`UiAlertDialogApp`
- feat: [Components]新增`UiIconBox`
- feat: [Components]`UiButton`新增`wide`参数，当为`true`时，应用最小宽度 min-w-20
- feat: [Components]`UiDataTable`声明步骤优化
- feat: [Components]`UiFieldDescription`样式统一
- feat: [Components]`UiFilterFormContent`支持超出换行
- feat: [Components]`UiFormItem`新增`description`参数，用于展示描述信息，支持插槽
- feat: [Components]`UiInputApp`内图标统一使用`@lucide/vue`
- feat: [Components]`UiPopoverConfirm`内的`content`支持插槽
- feat: [Components]`UiStatistic`内的图标展示改用`UiIconBox`；增加`loading`参数用于控制加载状态；`title`参数支持不传
- feat: [Components]`UiTagMap`/`UiTagMaps`所使用的`MapOption`类型迁移至`types.d.ts`；增加了公用的`getMapOption`工具方法
- feat: [Components]`UiUploadImage`支持按照`imageSize` `imageRatio`展示提示
- feat: [Components]移除`UiSectionTitle`
- feat: [Skills]新增 `detail-page` `detail-page` `list-page` `typescript-comment-normalizer` 四个Skill

### 🐞 Bug Fixes

- feat: [Components]`UiUploadDragger`内的svg图标导入修复

### 🚧 Others

- chore: [Deps]引入`cn`(0.5.0)替代原本的`cn`
- chore: [Deps]移除`clsx`、`tailwind-merge`，全部使用`cn`

# 2026-11-12

### 🚀 Features

- feat: [Components]新增`UiImageViewer`组件
- feat: [Components]新增`UiSectionHeader`组件
- feat: [Components]`UiPopoverConfirm`组件新增`cancelText`和`confirmText`参数用于自定义对应按钮文本
- feat: [Components]`UiTreeItem`的`subLabel`挪到`label`下方
- feat: [Components]`UiUploadImage`的大图查看能力使用`UiImageViewer`替代
- feat: [Components]`UiCardHeader`、`UiTabs`、`UiCard`、`UiCardHeader`、`UiCardTitle`、`UiInputApp`、`UiPeekPanel`、`UiTextareaApp`样式微调
- feat: [Components]`UiFilterFormMore`、`UiUploadDragger`、`UiUploadImage`的图标更换为`Lucide`图标集
- feat: [Components]`UiStatistic`颜色重整；去除了`iconBgGradient`参数及相关功能；`iconBg`更名为`color`以符合实际意义
- feat: [Skills]新增 `detail-page` `detail-page` `list-page` `typescript-comment-normalizer` 四个Skill

### 🐞 Bug Fixes

### 🚧 Others

- chore: [Deps]引入`cn`(0.5.0)替代原本的`cn`
- chore: [Deps]移除`clsx`、`tailwind-merge`，全部使用`cn`

# 2026-09-28

### 🚀 Features

- feat: 新增`usePaginationData`组合式函数，用于处理分页数据
- feat: 新增`UiAlertDialog`系列组件
- feat: 新增`UiCardApp`组件
- feat: 新增`UiDescription`系列组件
- feat: 新增`UiSectionTitle`组件
- feat: `UiPageTop`新增`right`插槽
- feat: `UiAvatarApp`逻辑优化
- feat: `UiButton`新增`action`尺寸
- feat: `UiCardDescription`字体大小改为`12px`
- feat: `UiCardTitle`字体大小改为`14px`
- feat: `UiCombobox`/`UiComboboxCascader`新增支持布尔型值，并统一了内部值格式
- feat: `UiInputGroup`/`UiInputNumber`/`UiNativeSelect`/`UiTagsInput`/`UiTextarea`去除阴影
- feat: `UiInputNumber`优化输入框数据同步逻辑减少不同步的情况发生
- feat: `UiScrollBar`增加hover态亮度变化
- feat: `UiSheetDescription`字体颜色改为`text-foreground-2`
- feat: `UiStatistic`新增`size`参数用于控制整体尺寸，目前支持`default`和`sm`，默认为`default`
- feat: `UiStatistic`新增`matchIconBg`参数用于控制是背景色否匹配图标背景颜色，默认为`false`
- feat: `UiTree`远程数据获取时`refetchOnWindowFocus`设为`false`
- feat: `UiUploadDragger`在达到最大上传数量上限时展示为只读样式，此时点击会提示用户`文件数量已达到上限 ${count} 份`

### 🐞 Bug Fixes

### 🚧 Others

- chore: `MapOptionValue`和`MapOption`新增布尔型
- chore: 统一去除类输入框录入组件的阴影

# 2026-08-31

初始版本
