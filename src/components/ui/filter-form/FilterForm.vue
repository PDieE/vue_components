<script setup lang="ts" generic="TForm extends Record<string, any>">
import { cloneDeep, pick } from 'es-toolkit'

import { useProvideFilterForm } from './context'

const form = defineModel<TForm>('form', { default: () => ({}) as TForm })
const { resetIgnore = [], moreCount = 0 } = defineProps<{
  /** 重置忽略字段 */
  resetIgnore?: (keyof TForm)[]
  /** 更多筛选数量 */
  moreCount?: number
}>()
const emits = defineEmits<{
  /** 重置 */
  reset: []
}>()

const defaultForm = cloneDeep(form.value)
/** 重置 */
function reset() {
  if (!resetIgnore || !resetIgnore.length) {
    form.value = cloneDeep(defaultForm)
    emits('reset')
    return
  }

  form.value = cloneDeep({
    ...defaultForm,
    ...pick(form.value, resetIgnore),
  }) as TForm
  emits('reset')
}

const { hasMore, hasAction } = useProvideFilterForm(
  form,
  reset,
  computed(() => moreCount),
)
</script>

<template>
  <div
    class="grid items-center gap-x-2.5 gap-y-5"
    :class="[
      hasMore && 'grid-cols-[auto_auto_1fr]',
      !hasMore && hasAction && 'grid-cols-[auto_1fr]',
    ]"
  >
    <slot />
  </div>
</template>
