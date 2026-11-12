# 1.2.0

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

# 1.1.0

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

# 1.0.0

# 2026-08-31

初始版本
