<template>
  <TooltipApp
    :content-props="{
      side: 'bottom',
      sideOffset: 5,
      class:
        'overflow-hidden bg-gray-900 px-3 py-1.5 text-xs text-white shadow-md data-[state=delayed-open]:animate-slide-upfade',
    }"
  >
    <template #trigger>
      <ToolbarButton
        v-bind="$attrs"
        class="flex items-center justify-center rounded-0.75 transition-all outline-none border-none cursor-pointer"
        :class="{
          'size-8': shape === 'square',
          'h-8 px-2': shape === 'rectangle',
          'bg-brand-bg text-brand hover:bg-brand-bg-hover': active,
          'bg-transparent  text-gray-600 hover:bg-gray-100': !active && !disabled,
          'opacity-50 cursor-not-allowed': disabled,
        }"
        :disabled="disabled"
        @click="emits('click', $event)"
      >
        <slot name="icon" />
      </ToolbarButton>
    </template>

    {{ tip }}
  </TooltipApp>
</template>

<script setup lang="ts">
import { ToolbarButton } from 'reka-ui'

import TooltipApp from '@/components/ui/tooltip/TooltipApp.vue'

defineOptions({
  inheritAttrs: false,
})

const {
  tip,
  active,
  disabled,
  shape = 'square',
} = defineProps<{
  /** 提示 */
  tip?: string
  /** 是否激活 */
  active?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /**
   * 形状
   * @describe square: 正方形; rectangle: 长方形;
   */
  shape?: 'square' | 'rectangle'
}>()
const emits = defineEmits<{
  /** 点击事件 */
  click: [event: MouseEvent]
}>()
</script>

<style scoped></style>
