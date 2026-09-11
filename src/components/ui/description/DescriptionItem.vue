<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from 'vue'
import { computed } from 'vue'

import { cn } from '@/lib/utils'

import {
  useDescriptionState,
  type DescriptionLabelWidth,
  type DescriptionOrientation,
} from './index'

defineOptions({
  inheritAttrs: false,
})

const {
  label,
  span: rawSpan = 1,
  orientation: itemOrientation,
  labelWidth: itemLabelWidth,
  ...props
} = defineProps<{
  /** 标签内容 */
  label?: string
  /** 当前描述项占用的列数 */
  span?: number
  /** 单项布局方向，未设置时继承 Description */
  orientation?: DescriptionOrientation
  /** 横向布局时的单项标签宽度，未设置时继承 Description */
  labelWidth?: DescriptionLabelWidth
  class?: HTMLAttributes['class']
}>()

const descriptionState = useDescriptionState()

const orientation = computed(
  () => itemOrientation ?? descriptionState?.orientation.value ?? 'vertical',
)
const labelWidth = computed(() => itemLabelWidth ?? descriptionState?.labelWidth.value)
const span = computed(() => {
  const column = descriptionState?.column.value ?? rawSpan
  return Math.min(Math.max(1, Math.floor(rawSpan)), column)
})
const itemStyle = computed<CSSProperties>(() => ({
  gridColumn: `span ${span.value} / span ${span.value}`,
}))
const labelStyle = computed<CSSProperties | undefined>(() => {
  if (orientation.value === 'vertical' || labelWidth.value === undefined) return undefined

  const width = typeof labelWidth.value === 'number' ? `${labelWidth.value}px` : labelWidth.value
  return { flexBasis: width, width }
})
</script>

<template>
  <div
    v-bind="$attrs"
    data-slot="description-item"
    :data-orientation="orientation"
    :class="cn('min-w-0', orientation === 'horizontal' && 'flex items-start gap-4', props.class)"
    :style="itemStyle"
  >
    <dt
      v-if="label || $slots.label"
      data-slot="description-label"
      :class="
        cn(
          'text-foreground-3 text-sm leading-5',
          orientation === 'horizontal' && 'shrink-0',
          orientation === 'vertical' && 'mb-2',
        )
      "
      :style="labelStyle"
    >
      <slot name="label">{{ label }}</slot>
    </dt>
    <dd
      data-slot="description-content"
      :class="
        cn('text-foreground min-w-0 text-sm leading-5', orientation === 'horizontal' && 'flex-1')
      "
    >
      <slot />
    </dd>
  </div>
</template>
