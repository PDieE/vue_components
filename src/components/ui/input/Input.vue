<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <!-- 暂时留着，理清楚之后可能要恢复这个颜色 -->
  <!-- placeholder:text-muted-foreground -->
  <input
    v-model="modelValue"
    data-slot="input"
    :class="
      cn(
        'file:text-foreground placeholder:text-foreground-3 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-8 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-normal  md:text-sm',
        'transition-[color,border-color]',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-disabled disabled:text-foreground-3',
        'focus-visible:border-brand',
        'aria-invalid:border-destructive',
        props.class,
      )
    "
  />
</template>
