---
name: detail-page
description: 新建或调整 Vue 只读详情页、详情侧栏或详情弹窗时使用，默认采用 UiSheetApp、UiSimpleWrap 与 useQuery，固定打开状态和查询逻辑的组织顺序，按业务选择分块标题及分割线。不用于新增编辑表单、列表页或基础组件修改。
license: MIT
metadata:
  author: github.com/PDieE
  version: "1.0.0"
---

# 详情页面模板

参考已有详情组件的组织方式实现只读详情，不照搬其业务字段、接口、标题或尺寸。使用 Vue 3 Composition API 和 `<script setup lang="ts">`，遵循目标项目的导入及自动导入约定。

## 容器与代码顺序

- 默认使用 `UiSheetApp`，通过 `v-model:open="open"` 控制打开，标题与尺寸按业务要求设置。
- 未明确要求时，详情页、详情侧栏和详情弹窗默认不添加 footer，也不添加底部关闭按钮；沿用容器自身的关闭入口。仅在业务明确需要底部操作时添加 footer。
- 业务需要时可使用 `UiDialogApp` 等其他容器，也可实现独立路由页面；不要为了套用侧栏模板改变实际交互。
- 弹层在 imports 及必要的 props/emits 声明后，保持以下逻辑顺序：`open` → `id` → `show` → `useQuery` → 其他派生数据和业务逻辑（如有）→ `defineExpose({ show })`。不要把 `show` 移到查询之后，也不要将这组简单逻辑额外抽成通用钩子。
- `show(value)` 先设置 `id.value`，再设置 `open.value = true`。参数类型与实际接口一致，不固定为字符串。
- `show` 的 JSDoc 用途说明固定为“打开”，不要改成“打开日志详情”“打开详情侧栏”等业务文案；有参数时保留多行 JSDoc 和 `@param` 参数说明。
- 独立页面由路由参数或实际入口提供响应式 `id`，不创建无用途的 `open`、`show`、`defineExpose`；保留标识声明 → 查询 → 派生数据和业务逻辑的顺序。

## 默认查询与状态展示

- 默认使用 `@tanstack/vue-query` 的 `useQuery` 获取详情，并用 `UiSimpleWrap` 统一呈现请求状态。更换容器不改变这组默认组合；仅在明确业务要求下调整。
- 使用响应式 `queryKey`，包含能区分业务的键和当前 `id`；`queryFn` 调用实际详情接口并读取当前标识。
- 弹层的 `enabled` 默认使用 `computed(() => open.value && !!id.value)`，独立页面按标识是否有效及实际业务条件启用。若合法标识可能为数字 `0`，改用明确的有效性判断。
- 默认设置 `refetchOnWindowFocus: false`。不在 `show`、watch 或生命周期里额外发起同一请求。
- 解构顺序沿用 `data, isFetching, isError, refetch`；`UiSimpleWrap` 绑定 `:loading="isFetching"`、`:error="isError"`、`@retry="refetch()"`。
- 正文通过 `<template v-if="data">` 保护字段访问，不重复维护 loading、error 或另写一套重试 UI。确有空详情语义时按组件契约接入空状态。
- 本技能针对只读详情。编辑流程仍优先使用传入记录，没有明确要求不额外请求详情接口获取待编辑数据。

## 内容结构

- 普通字段优先使用 `UiDescription` 和 `UiDescriptionItem`，列数及跨列按业务布局设置。
- 需要块级标题时使用 `UiSectionHeader`，每个标题及其对应内容放在同一个 `<section>` 内，以区分不同信息块。没有块级标题需求时不强加标题或分块。
- 标题通过 `title` 传入，图标按需使用 `icon` 或 `icon` 插槽，右侧操作内容使用 `actions` 插槽。
- 需要分割线时使用 `UiSeparator`；分块之间的分割线作为相邻 `section` 的兄弟节点，不使用 `hr`、边框或手写元素模拟。
- 间距可按已有页面在原生容器上组织；除非明确要求，不修改已有组件样式，也不在使用处自定义或覆盖组件样式。
- 字段、顺序、分块和条件展示以业务要求及参考图为准；接口缺失字段使用临时字段名占位，不修改现有类型定义，可在页面局部声明临时展示类型以保持类型检查通过。
- 时间类字段没有明确的特殊展示要求时，直接展示接口原值，不进行日期格式化、截断、时区转换或相对时间转换，也不为此添加格式化方法或日期库依赖。空值按业务要求或项目约定展示占位。
- 空值、缺省内容及无可用操作的占位统一使用半角连字符 `-`，不使用长破折号 `—` 或短破折号 `–`；注意保留有意义的 `0`、`false`；状态和枚举按项目已有映射组件或工具展示。

## 弹层示例

以下 `apiDetail`、导入路径、查询键、字段及标题均为示例，落地时替换为真实业务定义。示例仅有一个信息块，需要更多块时按上述规则组合 `section` 与 `UiSeparator`；不为套模板添加业务未要求的内容。

```vue
<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'

import { apiDetail } from '@/api/business'

const open = ref(false)
const id = ref('')
/**
 * 打开
 * @param value id
 */
function show(value: string) {
  id.value = value
  open.value = true
}
const { data, isFetching, isError, refetch } = useQuery({
  queryKey: computed(() => ['business-detail', id.value]),
  queryFn: () => apiDetail(id.value),
  enabled: computed(() => open.value && !!id.value),
  refetchOnWindowFocus: false,
})

defineExpose({ show })
</script>

<template>
  <UiSheetApp v-model:open="open" title="详情">
    <UiSimpleWrap :loading="isFetching" :error="isError" @retry="refetch()">
      <template v-if="data">
        <section class="space-y-4">
          <UiSectionHeader title="基本信息" />
          <UiDescription :column="2">
            <UiDescriptionItem label="名称">{{ data.name || '-' }}</UiDescriptionItem>
          </UiDescription>
        </section>
      </template>
    </UiSimpleWrap>
  </UiSheetApp>
</template>
```

## 完成前核对

核对入口传参、查询标识、接口类型、打开与切换记录后的查询、加载/失败/重试，以及字段和分块顺序。独立声明的方法添加 JSDoc：有参数时使用多行用途说明和 `@param`，无参数时使用 `/** 方法说明 */` 单行注释；不添加返回内容注释，内联方法及回调无需注释。`show` 的用途说明始终使用“打开”。
