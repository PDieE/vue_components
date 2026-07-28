<template>
  <VeeField v-slot="scope" :name="name">
    <UiField :class="props.class">
      <UiFieldLabel v-if="$slots.label" :required="required"><slot name="label" /></UiFieldLabel>
      <UiFieldLabel v-else-if="label" :required="required">{{ label }}</UiFieldLabel>
      <slot v-bind="scope" />
      <UiFieldError :errors="scope.errors" />
    </UiField>
  </VeeField>
</template>

<script lang="ts" setup>
import { Field as VeeField } from 'vee-validate'
import type { HTMLAttributes } from 'vue'

const {
  name,
  label,
  required = false,
  ...props
} = defineProps<{
  class?: HTMLAttributes['class']
  /** 字段名 */
  name: string
  /** 标题 */
  label?: string
  /** 是否必填 */
  required?: boolean
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
</script>

<style lang="less" scoped></style>
