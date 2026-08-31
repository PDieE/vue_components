<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

export type TagsSelectValue = string | number | boolean | null | undefined

export interface TagsSelectOption {
  label: string
  value: TagsSelectValue
}

const modelValue = defineModel<TagsSelectValue[]>({ default: () => [] })
const { options, ...props } = defineProps<{
  class?: HTMLAttributes['class']
  options: TagsSelectOption[]
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
/**
 * 获取选项的唯一键值
 * @param value 选项值
 */
function getKey(value: TagsSelectValue) {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (value === false) return 'false'
  if (value === true) return 'true'

  return value
}
/**
 * 点击标签时触发
 * @param value 选项值
 */
function tagClick(value: TagsSelectValue) {
  if (!Array.isArray(modelValue.value)) {
    modelValue.value = [value]
    return
  }

  if (modelValue.value.includes(value)) {
    modelValue.value = modelValue.value.filter((item) => item !== value)
    return
  }

  modelValue.value = [...modelValue.value, value]
}
</script>

<template>
  <div :class="cn('flex flex-wrap gap-1', props.class)">
    <UiButton
      v-for="option in options"
      type="button"
      size="xs"
      :variant="modelValue?.includes(option.value) ? undefined : 'text'"
      :theme="modelValue?.includes(option.value) ? 'brand' : undefined"
      :key="getKey(option.value)"
      @click="tagClick(option.value)"
    >
      {{ option.label }}
    </UiButton>
  </div>
</template>
