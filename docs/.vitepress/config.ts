import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vue Components',
  description: 'Vue UI 组件文档',
  vite: {
    plugins: [
      tailwindcss(),
      Components({
        dirs: ['../src/components'],
        directoryAsNamespace: true,
        collapseSamePrefixes: true,
        include: [/\.vue$/, /\.vue\?vue/, /\.vue\.[tj]sx?\?vue/, /\.md$/],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../../src', import.meta.url)),
      },
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '组件', link: '/components' },
      { text: '快速开始', link: '/getting-started' }
    ],

    sidebar: [
      {
        text: '开始',
        items: [
          { text: '快速开始', link: '/getting-started' },
          { text: '组件概览', link: '/components' }
        ]
      },
      {
        text: '组件',
        items: [
          { text: 'Alert 提示', link: '/components/alert' },
          { text: 'Aspect Ratio 宽高比', link: '/components/aspect-ratio' },
          { text: 'Avatar 头像', link: '/components/avatar' },
          { text: 'Badge 徽标', link: '/components/badge' },
          { text: 'Button 按钮', link: '/components/button' },
          { text: 'Button Select 按钮选择器', link: '/components/button-select' },
          { text: 'Calendar 日历', link: '/components/calendar' },
          { text: 'Card 卡片', link: '/components/card' },
          { text: 'Checkbox 复选框', link: '/components/checkbox' },
          { text: 'Collapsible 折叠面板', link: '/components/collapsible' },
          { text: 'Combobox 组合框', link: '/components/combobox' },
          { text: 'Combobox Cascader 级联选择器', link: '/components/combobox-cascader' },
          { text: 'Command 命令菜单', link: '/components/command' },
          { text: 'Data Table 数据表格', link: '/components/data-table' },
          { text: 'Date Picker 日期选择', link: '/components/date-picker' },
          { text: 'Date Picker Range 日期范围选择', link: '/components/date-picker-range' },
          { text: 'Dialog 对话框', link: '/components/dialog' },
          { text: 'Dropdown Menu 下拉菜单', link: '/components/dropdown-menu' },
          { text: 'Empty 空状态', link: '/components/empty' },
          { text: 'Field 表单字段', link: '/components/field' },
          { text: 'Filter Form 筛选表单', link: '/components/filter-form' },
          { text: 'Form 表单', link: '/components/form' },
          { text: 'Hover Card 悬浮卡片', link: '/components/hover-card' },
          { text: 'Image 图片', link: '/components/image' },
          { text: 'Input 输入框', link: '/components/input' },
          { text: 'Input Group 输入组', link: '/components/input-group' },
          { text: 'Label 标签', link: '/components/label' },
          { text: 'Link 链接', link: '/components/link' },
          { text: 'Map Select 地图选择', link: '/components/map-select' },
          { text: 'Native Select 原生选择器', link: '/components/native-select' },
          { text: 'Pagination 分页', link: '/components/pagination' },
          { text: 'Peek Panel 预览面板', link: '/components/peek-panel' },
          { text: 'Popover 浮层', link: '/components/popover' },
          { text: 'Progress 进度条', link: '/components/progress' },
          { text: 'Radio Group 单选组', link: '/components/radio-group' },
          { text: 'Range Calendar 日期范围日历', link: '/components/range-calendar' },
          { text: 'Scroll Area 滚动区域', link: '/components/scroll-area' },
          { text: 'Separator 分隔线', link: '/components/separator' },
          { text: 'Sheet 侧边面板', link: '/components/sheet' },
          { text: 'Simple Wrap 状态包装器', link: '/components/simple-wrap' },
          { text: 'Skeleton 骨架屏', link: '/components/skeleton' },
          { text: 'Sonner 通知', link: '/components/sonner' },
          { text: 'Spinner 加载器', link: '/components/spinner' },
          { text: 'Statistic 统计数值', link: '/components/statistic' },
          { text: 'Stepper 步骤条', link: '/components/stepper' },
          { text: 'Switch 开关', link: '/components/switch' },
          { text: 'Table 表格', link: '/components/table' },
          { text: 'Tabs 标签页', link: '/components/tabs' },
          { text: 'Tag 标签', link: '/components/tag' },
          { text: 'Tags Input 标签输入', link: '/components/tags-input' },
          { text: 'Tags Select 标签选择器', link: '/components/tags-select' },
          { text: 'Textarea 文本域', link: '/components/textarea' },
          { text: 'Time Picker 时间选择', link: '/components/time-picker' },
          { text: 'Tooltip 文字提示', link: '/components/tooltip' },
          { text: 'Tree 树形结构', link: '/components/tree' },
          { text: 'Upload 上传', link: '/components/upload' },
          { text: 'Wheel Picker 滚轮选择器', link: '/components/wheel-picker' }
        ]
      }
    ]
  }
})
