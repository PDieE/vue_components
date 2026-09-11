<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from 'vue'
import { computed } from 'vue'

import { cn } from '@/lib/utils'

import {
  useProvideDescriptionState,
  type DescriptionLabelWidth,
  type DescriptionOrientation,
} from './index'

defineOptions({
  inheritAttrs: false,
})

const {
  column = 1,
  orientation = 'vertical',
  labelWidth,
  ...props
} = defineProps<{
  /** 每行显示的描述项数量 */
  column?: number
  /** 描述项布局方向 */
  orientation?: DescriptionOrientation
  /** 横向布局时的标签宽度 */
  labelWidth?: DescriptionLabelWidth
  class?: HTMLAttributes['class']
}>()

const normalizedColumn = computed(() => Math.max(1, Math.floor(column)))
const normalizedOrientation = computed(() => orientation)
const resolvedLabelWidth = computed(() => labelWidth)

const gridStyle = computed<CSSProperties>(() => ({
  gridTemplateColumns: `repeat(${normalizedColumn.value}, minmax(0, 1fr))`,
}))

useProvideDescriptionState(normalizedOrientation, normalizedColumn, resolvedLabelWidth)
</script>

<template>
  <dl
    v-bind="$attrs"
    data-slot="description"
    :data-orientation="orientation"
    :class="cn('grid gap-x-10 gap-y-7', props.class)"
    :style="gridStyle"
  >
    <slot />
  </dl>
</template>
