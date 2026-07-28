<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import type { ScrollAreaRootProps } from 'reka-ui'
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaViewport } from 'reka-ui'
import { useTemplateRef, type HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

import ScrollBar from './ScrollBar.vue'

type ScrollAreaOrientation = 'horizontal' | 'vertical' | 'both'

const props = withDefaults(
  defineProps<
    ScrollAreaRootProps & {
      class?: HTMLAttributes['class']
      viewClass?: HTMLAttributes['class']
      orientation?: ScrollAreaOrientation
      barClass?: HTMLAttributes['class']
    }
  >(),
  {
    orientation: 'vertical',
  },
)
const emits = defineEmits<{
  /**
   * 滚动事件
   * @param event 滚动事件
   */
  scroll: [event: Event]
}>()

const delegatedProps = reactiveOmit(props, 'class', 'orientation')

const viewportRef = useTemplateRef('viewportRef')
defineExpose({ viewportRef })
</script>

<template>
  <ScrollAreaRoot
    data-slot="scroll-area"
    v-bind="delegatedProps"
    :class="cn('relative', props.class)"
  >
    <ScrollAreaViewport
      ref="viewportRef"
      data-slot="scroll-area-viewport"
      :class="
        cn(
          'size-full rounded-[inherit] transition-[color,box-shadow] outline-none',
          props.viewClass,
        )
      "
      @scroll="emits('scroll', $event)"
    >
      <slot></slot>
    </ScrollAreaViewport>
    <ScrollBar
      v-if="orientation === 'vertical' || orientation === 'both'"
      :class="props.barClass"
    />
    <ScrollBar
      v-if="orientation === 'horizontal' || orientation === 'both'"
      orientation="horizontal"
      :class="props.barClass"
    />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
