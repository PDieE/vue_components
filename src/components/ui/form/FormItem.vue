<template>
  <VeeField v-slot="scope" :name="name">
    <UiField :class="props.class">
      <div
        v-if="$slots.label || label || $slots.description || description || $slots.action"
        class="flex items-center justify-between gap-3"
      >
        <UiFieldContent v-if="$slots.label || label || $slots.description || description">
          <UiFieldLabel v-if="$slots.label || label" :required="required">
            <slot name="label">{{ label }}</slot>
          </UiFieldLabel>
          <UiFieldDescription v-if="$slots.description || description">
            <slot name="description">{{ description }}</slot>
          </UiFieldDescription>
        </UiFieldContent>
        <slot name="action" />
      </div>
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
  description,
  required = false,
  ...props
} = defineProps<{
  class?: HTMLAttributes['class']
  /** 字段名 */
  name: string
  /** 标题 */
  label?: string
  /** 标题下方的说明 */
  description?: string
  /** 是否必填 */
  required?: boolean
}>()
</script>

<style lang="less" scoped></style>
