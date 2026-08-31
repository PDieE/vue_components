<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'

import { cn } from '@/lib/utils'

export type ButtonSelectValue = string | number | boolean | null | undefined

export interface ButtonSelectOption {
  label: string
  value: ButtonSelectValue
  disabled?: boolean
}

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  options: ButtonSelectOption[]
  disabled?: boolean
  class?: HTMLAttributes['class']
}>()

const modelValue = defineModel<ButtonSelectValue>()

const tabsValue = computed({
  get: () => (modelValue.value == null ? undefined : String(modelValue.value)),
  set: (value) => {
    modelValue.value = props.options.find((option) => String(option.value) === value)?.value
  },
})
</script>

<template>
  <UiTabs
    v-bind="$attrs"
    v-model="tabsValue"
    :disabled="disabled"
    :class="cn('w-fit', props.class)"
  >
    <UiTabsListButton
      :aria-invalid="$attrs['aria-invalid']"
      :class="
        cn(
          'rounded-lg border border-transparent transition-[border-color,box-shadow]',
          'aria-invalid:border-destructive',
        )
      "
    >
      <UiTabsTriggerButton
        v-for="item in options"
        :key="String(item.value)"
        :value="String(item.value)"
        :disabled="disabled || item.disabled"
      >
        {{ item.label }}
      </UiTabsTriggerButton>
    </UiTabsListButton>
  </UiTabs>
</template>
