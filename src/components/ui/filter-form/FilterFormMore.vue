<script setup lang="ts" generic="TForm extends Record<string, any>, K extends keyof TForm">
import { Icon } from '@iconify/vue'
import { cloneDeep, pick } from 'es-toolkit'

import { useInjectFilterForm } from './context'

// 在外部请使用 `<!-- @vue-generic {FilterForm,MoreFilterFormFields} -->` 来声明泛型，以便获取类型提示
type TMoreForm = Pick<TForm, K>

const { fields, size = 480 } = defineProps<{
  /** 更多筛选字段 */
  fields: K[]
  /** 弹窗宽度 */
  size?: number
}>()
const emits = defineEmits<{
  /** 搜索 */
  search: [form: TMoreForm]
}>()

onBeforeMount(() => {
  registerMore()
})
onBeforeUnmount(() => {
  registerMore(false)
})

/**
 * ====================
 *       基本逻辑
 * ====================
 */

const { filterForm, registerMore, moreCount } = useInjectFilterForm()!
const form = ref<TMoreForm>(pick(filterForm.value as TForm, fields))
const defaultForm = cloneDeep(form.value)
const open = shallowRef(false)
watch(open, (v) => {
  if (!v) return
  form.value = cloneDeep(pick(filterForm.value as TForm, fields))
})

/** 重置 */
function reset() {
  form.value = cloneDeep(defaultForm)
}
/** 查询 */
function search() {
  open.value = false
  emits('search', cloneDeep(form.value))
}
</script>

<template>
  <UiPopover v-model:open="open">
    <UiPopoverTrigger as-child>
      <UiButton
        variant="outline"
        class="gap-0.5 px-2!"
        :theme="open || moreCount > 0 ? 'brand' : 'default'"
        :size="!moreCount ? 'icon' : undefined"
      >
        <template #icon><Icon icon="lucide:filter" /></template>
        <template v-if="moreCount">({{ moreCount }})</template>
      </UiButton>
    </UiPopoverTrigger>
    <UiPopoverContent class="p-0" :style="{ width: `min(100vw,${size}px)` }" align="start">
      <div class="px-5 py-4 flex border-b border-separator">
        <div class="text-foreground flex-1">筛选项</div>
        <UiButton class="size-4 rounded" variant="ghost" size="icon-xs" @click="open = false">
          <template #icon><Icon class="size-3.5" icon="icon-park-outline:close" /></template>
        </UiButton>
      </div>
      <div class="px-5 py-4 grid grid-cols-2 gap-4"><slot :moreForm="form" /></div>
      <div class="px-5 py-4 flex gap-4 border-t border-separator">
        <UiButton class="flex-1" variant="outline" @click="reset()">重置</UiButton>
        <UiButton class="flex-1" theme="brand" @click="search()">查看结果</UiButton>
      </div>
    </UiPopoverContent>
  </UiPopover>
</template>
