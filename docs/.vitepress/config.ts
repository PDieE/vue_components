import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vue Components',
  description: 'Vue UI 组件文档',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '组件', link: '/components/' },
      { text: '快速开始', link: '/guide/getting-started' }
    ],

    sidebar: [
      {
        text: '开始使用',
        items: [{ text: '快速开始', link: '/guide/getting-started' }]
      },
      {
        text: '组件',
        items: [
          { text: '组件列表', link: '/components/' },
          { text: 'UiButton 按钮', link: '/components/button' },
          { text: 'UiSpinner 加载器', link: '/components/spinner' }
        ]
      }
    ]
  }
})
