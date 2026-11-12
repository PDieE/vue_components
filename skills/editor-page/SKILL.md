---
name: editor-page
description: 新建或调整 Vue 新增/编辑表单、编辑侧栏或编辑弹窗时使用，默认采用 UiSheetApp 与 useVeeForm，固定 open、show、表单和提交逻辑顺序，规范记录回填、上传字段转换及表单绑定。不用于只读详情、列表或基础组件修改。
license: MIT
metadata:
  author: github.com/PDieE
  version: "1.0.0"
---

# 新增/编辑页面模板

参考已有编辑组件的组织方式实现新增/编辑流程，不照搬业务字段、接口、标题或尺寸。使用 Vue 3 Composition API 和 `<script setup lang="ts">`，遵循目标项目的导入及自动导入约定。默认项目已有本技能涉及的 Ui 组件、`useVeeForm` 及上传转换工具，按需查看实际契约，不重复创建。

## 容器与代码顺序

- 默认使用 `UiSheetApp`，通过 `v-model:open="open"` 控制打开；标题根据新增/编辑状态及业务设置。
- 业务需要时可使用 `UiDialogApp` 等其他容器，也可实现独立页面，不为套用模板改变实际交互。
- imports 及必要的 props/emits、局部类型声明之后，固定保持：`open` → `show` → `useVeeForm` → 辅助表单逻辑（如 `useFieldArray`、派生数据）→ `doSubmit` → `defineExpose({ show })`。`open`、`show` 放在逻辑顶部，不把 `show` 移到表单声明之后。
- `show` 采用函数声明，通常只有 `record?: Partial<业务类型>` 一个参数；无记录表示新增，有记录表示回填。只有业务明确需要时才调整参数。
- `show` 的 JSDoc 用途说明固定为“打开”，不要改成业务文案；参数使用 `@param record 数据`。
- 独立页面按实际入口初始化表单，不创建无用途的 `open`、`show`、`defineExpose`；保留表单初始化 → 辅助表单逻辑 → 提交的相对顺序。

## 打开与回填

- 编辑优先使用传入记录；没有明确要求时，不额外调用详情接口获取待编辑数据。
- 存在 `record` 时，必须使用 `reset({ ...initialValues, ...record, ...字段转换 })`；即使 `reset` 内部已经合并默认值，也保留显式的 `...initialValues` 和 `...record`，顺序不可颠倒。转换字段放在记录展开之后。
- 无 `record` 时调用 `reset()`，清除上次编辑的字段及校验状态；重置完成后再设置 `open.value = true`。
- 需要空值归一化或数组转换时按字段处理。涉及可变数组、嵌套数据时避免修改传入记录，不直接将父级数据当作可编辑状态。
- 沿用 `if (submitting.value) return`，阻止提交期间重新打开或切换记录。

## 表单与提交

- 表单逻辑主要使用 `useVeeForm`，按业务定义 Zod `schema`、`initialValues` 和 `request`；默认解构顺序为 `formData, initialValues, submitting, submit, reset`，仅按实际需要增减。
- schema 与默认值使用录入组件需要的值类型；必填、格式、取值范围等校验按业务设置，不照搬参考页。通过钩子提供的表单能力修改字段，不直接改写只读的 `formData`。
- 在 `request` 中完成表单值到接口参数的转换，并返回请求 Promise。新增和编辑接口按实际标识判断，标识类型及有效性判断与接口一致，不固定假定所有标识均为非空字符串。
- `doSubmit` 一般使用 `submit().then(() => { ... })`，不要默认改写为 `async/await`；只有确有异步编排需求时调整。提交前保留请求中判断。
- 仅在提交成功后提示成功、关闭弹层并 `emit('success')`；校验或请求失败时保留表单，错误处理沿用项目已有机制，不在 `finally` 中执行成功行为。
- 表单使用 `UiForm @submit="doSubmit"`。提交按钮绑定 `:loading="submitting"`，取消及其他可变更表单的操作绑定 `:disabled="submitting"`。
- 默认参考当前页设置 `:closable="!submitting"`、`:close-on-escape="!submitting"`、`:close-on-interact-outside="false"`；其他容器按实际支持的属性实现对应行为。

## 上传字段

- 接口字段为 `string`，但上传组件接收文件数组时，表单字段按 `UploadFile[]` 声明；Zod 示例为 `z.array(z.custom<UploadFile>())`，默认值为 `[]`。
- 回填时使用 `strArr2UploadFiles(record.文件字段)`；提交时使用 `UploadFiles2Str(文件字段)` 转回字符串，是否以 `?? ''` 兜底按接口要求确定。
- 不为适配表单修改现有接口类型，也不把接口字符串直接绑定到上传组件。确需显式表单类型时，在页面局部替换对应字段类型。
- 上传数量、大小、格式、尺寸等限制按业务设置；上传组件同样绑定字段、禁用状态及错误状态。

## 表单项与内容结构

- 除非特殊说明，每个 `UiFormItem` 都必须通过 `v-slot="{ componentField, errors }"` 获取并实际使用两者；录入组件绑定 `v-bind="componentField"`、`:disabled="submitting"`、`:aria-invalid="!!errors.length"`。业务自身禁用条件与 `submitting` 合并。
- `UiFormItem` 的 `name` 与 schema 字段路径保持一致。动态数组按实际需要使用 `useFieldArray`，使用稳定的字段 key 和正确的索引路径。
- 若某个 `UiFormItem` 仅承载数组分组或 action 插槽，且输入由子级表单项管理，可按实际组件契约作为结构性例外；不要解构未使用的变量来凑模板。实际录入字段仍遵循完整绑定规则。
- 不同时给同一录入组件叠加冲突的 `v-model` 与 `componentField`；特殊组件如需适配值或事件，依据实际契约保留等价的字段更新、校验和禁用行为。
- 需要块级标题时使用 `UiSectionHeader`，标题和对应内容放在同一个 `<section>` 内；没有需求时不强加标题。
- 标题通过 `title` 传入，图标按需使用 `icon` 或 `icon` 插槽，右侧操作内容使用 `actions` 插槽。
- 分割线使用 `UiSeparator`；分块之间作为相邻 `section` 的兄弟节点，不用 `hr`、边框或手写元素模拟。
- 字段、顺序和分块以业务要求及参考图为准；接口缺失字段使用临时字段名占位，不修改现有接口类型，可按需声明局部表单类型。
- 除非特殊说明，所有表单布局间距统一为 `6`（如 `gap-6`、`space-y-6`），包括表单项之间、分块内部、分块之间、多列字段网格及动态字段组，不沿用旧页面的其他间距值。`UiForm` 默认已通过 `UiFieldGroup` 提供 `gap-6`，无需重复设置；自定义布局在原生容器上组织。组件内部的标签、提示、图标与控件间距沿用组件默认样式。
- 除非明确要求，不修改已有组件样式，也不在使用处自定义或覆盖其样式。

## 弹层示例

以下业务类型、接口、路径、标识和字段均为示例，落地时替换为实际定义。示例展示字符串上传字段的双向转换；不需要上传时移除对应字段和导入。按需分块时再添加 `section`、`UiSectionHeader` 与 `UiSeparator`。

```vue
<script setup lang="ts">
import { toast } from 'vue-sonner'
import { z } from 'zod'

import { apiRecordAdd, apiRecordEdit } from '@/api'
import type { BusinessRecord } from '@/api/model'
import { strArr2UploadFiles, UploadFiles2Str, type UploadFile } from '@/components/ui/upload'

const emit = defineEmits<{ success: [] }>()

const open = ref(false)
/**
 * 打开
 * @param record 数据
 */
function show(record?: Partial<BusinessRecord>) {
  if (submitting.value) return
  if (record) {
    reset({
      ...initialValues,
      ...record,
      photo: strArr2UploadFiles(record.photo),
    })
  } else {
    reset()
  }
  open.value = true
}
const { formData, initialValues, submitting, submit, reset } = useVeeForm({
  schema: z.object({
    id: z.string().optional(),
    name: z.string().trim().nonempty('请输入名称'),
    photo: z.array(z.custom<UploadFile>()),
  }),
  initialValues: {
    id: undefined,
    name: '',
    photo: [],
  },
  request: ({ id, photo, ...values }) => {
    const data = { ...values, photo: UploadFiles2Str(photo) ?? '' }
    return id ? apiRecordEdit({ ...data, id }) : apiRecordAdd(data)
  },
})
/** 提交 */
function doSubmit() {
  if (submitting.value) return
  submit().then(() => {
    toast.success(formData.id ? '编辑成功' : '新增成功')
    open.value = false
    emit('success')
  })
}

defineExpose({ show })
</script>

<template>
  <UiSheetApp
    v-model:open="open"
    :title="`${formData.id ? '编辑' : '新增'}记录`"
    :closable="!submitting"
    :close-on-escape="!submitting"
    :close-on-interact-outside="false"
  >
    <UiForm @submit="doSubmit">
      <UiFormItem v-slot="{ componentField, errors }" label="名称" name="name" required>
        <UiInputApp
          v-bind="componentField"
          placeholder="请输入名称"
          :disabled="submitting"
          :aria-invalid="!!errors.length"
        />
      </UiFormItem>
      <UiFormItem v-slot="{ componentField, errors }" label="照片" name="photo">
        <UiUploadImage
          v-bind="componentField"
          :disabled="submitting"
          :aria-invalid="!!errors.length"
        />
      </UiFormItem>
    </UiForm>
    <template #footer>
      <UiButton variant="outline" :disabled="submitting" @click="open = false">取消</UiButton>
      <UiButton theme="brand" :loading="submitting" @click="doSubmit">保存</UiButton>
    </template>
  </UiSheetApp>
</template>
```

## 完成前核对

核对代码顺序、`show` 注释及参数、编辑分支的默认值与记录展开、上传字段转换、所有录入字段的绑定与禁用/错误状态。检查新增、编辑、切换记录、编辑后再次新增，以及提交成功和失败时的行为。独立声明的方法添加 JSDoc：有参数时使用多行用途说明及 `@param`，无参数时使用 `/** 方法说明 */` 单行注释，不添加返回内容注释；内联方法及回调无需注释。
