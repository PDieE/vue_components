<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

import type { WheelPickerGroupColumn, WheelPickerValue } from '.'
import WheelPicker from './WheelPicker.vue'

const modelValue = defineModel<WheelPickerValue[]>({ default: () => [] })

const props = withDefaults(
  defineProps<{
    /** 多列选项 */
    columns?: WheelPickerGroupColumn[]
    /** 选中项上方/下方最多显示的选项数量 */
    visibleOptionCount?: number
    /** 是否禁用 */
    disabled?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    columns: () => [],
    visibleOptionCount: 3,
    disabled: false,
  },
)

const emits = defineEmits<{
  /** 值改变时触发 */
  change: [v: WheelPickerValue[]]
}>()

function updateColumnValue(columnIndex: number, value?: WheelPickerValue) {
  if (value === undefined || props.disabled) return

  const nextValue = [...modelValue.value]
  if (nextValue[columnIndex] === value) return

  nextValue[columnIndex] = value
  modelValue.value = nextValue
  emits('change', nextValue)
}
</script>

<template>
  <div
    data-slot="wheel-picker-group"
    :class="cn('inline-flex select-none gap-1', disabled && 'pointer-events-none', props.class)"
  >
    <WheelPicker
      v-for="(column, columnIndex) in columns"
      :key="columnIndex"
      :model-value="modelValue[columnIndex]"
      :options="column.options"
      :visible-option-count="visibleOptionCount"
      :disabled="disabled || column.disabled"
      :class="column.class"
      @update:model-value="updateColumnValue(columnIndex, $event)"
    />
  </div>
</template>
