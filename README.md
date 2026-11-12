# vue_components

## Agent Skills

仓库提供以下技能，完整保留从 `u2g_dashboard` 复制的指令与 `agents/openai.yaml` 元数据：

| 技能 | 用途 |
| --- | --- |
| [detail-page](skills/detail-page/SKILL.md) | Vue 只读详情页、详情侧栏和详情弹窗 |
| [editor-page](skills/editor-page/SKILL.md) | Vue 新增/编辑表单、记录回填和上传字段转换 |
| [list-page](skills/list-page/SKILL.md) | Vue 列表、筛选、分页、行操作和状态切换 |
| [typescript-comment-normalizer](skills/typescript-comment-normalizer/SKILL.md) | TypeScript model/DTO 属性注释与声明规范化 |

前三个技能面向已具备本仓库对应 `Ui` 组件和 composables 的 Vue 3 项目；安装技能只安装指令，不会安装组件或项目依赖。

### 通过 npx skills 安装

在需要使用技能的项目目录运行，交互选择技能和目标编码代理：

```sh
npx skills add PDieE/vue_components
```

只查看可安装技能：

```sh
npx skills add PDieE/vue_components --list
```

将四个技能全部安装给 Codex（当前项目）：

```sh
npx skills add PDieE/vue_components \
  --skill detail-page editor-page list-page typescript-comment-normalizer \
  --agent codex --yes
```

只安装某个技能时使用 `--skill <技能名>`；跨项目使用时追加 `--global`。

远程安装需要先将 `skills/` 目录提交并推送到该 GitHub 仓库的默认分支；私有仓库需要已有访问权限。推送前也可使用本地仓库路径安装：

```sh
npx skills add /Users/ethan/workspace/vue_components --list
npx skills add /Users/ethan/workspace/vue_components --skill detail-page --agent codex --yes
```

技能采用 CLI 支持的 `skills/<技能名>/SKILL.md` 目录结构，无需发布 npm 包或修改 `package.json`。用法参见 [skills 官方文档](https://github.com/vercel-labs/skills#readme)。

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
