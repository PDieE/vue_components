<script setup lang="ts" generic="TValue extends CheckboxGroupValue = CheckboxGroupValue">
import type { HTMLAttributes } from 'vue'
import { computed, useAttrs } from 'vue'

import { cn } from '@/lib/utils'

import Checkbox from './Checkbox.vue'

/** CheckboxGroup 支持的选项值类型。 */
export type CheckboxGroupValue = string | number | boolean

export interface CheckboxGroupOption<TValue extends CheckboxGroupValue = CheckboxGroupValue> {
  /** 选项展示文案。 */
  label: string
  /** 选项提交值，会写入 v-model 数组。 */
  value: TValue
  /** 是否禁用当前选项。 */
  disabled?: boolean
}

defineOptions({
  inheritAttrs: false,
})

const modelValue = defineModel<TValue[]>({ default: () => [] })

const props = withDefaults(
  defineProps<{
    /** 可选项列表。 */
    options: CheckboxGroupOption<TValue>[]
    /** 是否禁用整组选项。 */
    disabled?: boolean
    /** 是否展示加载态，加载中会禁止切换。 */
    loading?: boolean
    /** 根节点类名。 */
    class?: HTMLAttributes['class']
    /** 单个选项 label 类名。 */
    itemClass?: HTMLAttributes['class']
  }>(),
  {
    disabled: false,
    loading: false,
  },
)

const attrs = useAttrs()

const ariaInvalid = computed(() => attrs['aria-invalid'])

function isChecked(value: TValue) {
  return modelValue.value.some((item) => Object.is(item, value))
}

/** 避免 1 和 '1' 这类不同类型的值在 v-for key 上碰撞。 */
function getOptionKey(value: TValue) {
  return `${typeof value}:${String(value)}`
}

/** 统一处理 Reka Checkbox 的 true / false / indeterminate 状态。 */
function toggleOption(value: TValue, checked: boolean | 'indeterminate') {
  if (checked === true) {
    if (!isChecked(value)) {
      modelValue.value = [...modelValue.value, value]
    }

    return
  }

  modelValue.value = modelValue.value.filter((item) => !Object.is(item, value))
}
</script>

<template>
  <div
    v-bind="attrs"
    data-slot="checkbox-group"
    role="group"
    :class="cn('flex flex-wrap gap-3', props.class)"
  >
    <label
      v-for="option in options"
      :key="getOptionKey(option.value)"
      :class="
        cn(
          'inline-flex min-h-5 items-center gap-2 text-sm leading-none text-foreground',
          (disabled || loading || option.disabled) && 'cursor-not-allowed text-foreground-3',
          !(disabled || loading || option.disabled) && 'cursor-pointer',
          props.itemClass,
        )
      "
    >
      <Checkbox
        :model-value="isChecked(option.value)"
        :disabled="disabled || loading || option.disabled"
        :aria-invalid="ariaInvalid"
        @update:model-value="toggleOption(option.value, $event)"
      >
        <UiSpinner v-if="loading" class="size-3" />
      </Checkbox>
      <slot name="option" :option="option" :checked="isChecked(option.value)">
        <span>{{ option.label }}</span>
      </slot>
    </label>
  </div>
</template>
