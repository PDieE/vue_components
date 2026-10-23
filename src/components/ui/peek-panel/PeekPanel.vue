<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'

import { cn } from '@/lib/utils'

import { useInjectPeekPanel } from './context'

const {
  title = '',
  width = 220,
  ...props
} = defineProps<{
  class?: HTMLAttributes['class']
  /** 标题 */
  title?: string
  /** 宽度 */
  width?: number
  /** 高度 */
  height?: number
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const { id, peek } = useInjectPeekPanel()!
const target = computed(() => (peek.value ? `#peek-hover-${id}` : `#peek-card-${id}`))
</script>

<template>
  <UiCard
    v-if="!peek"
    :class="cn('p-0', props.class)"
    :style="{ width: `${width}px`, height: `${height}px` }"
  >
    <UiCardContent class="flex-1 overflow-hidden p-0 flex flex-col">
      <div class="flex items-center border-b pl-5 py-5 pr-3">
        <UiCardTitle class="flex-1 truncate">{{ title }}</UiCardTitle>
        <UiButton variant="ghost" size="icon-xs" @click="peek = !peek">
          <icon class="text-foreground-2" icon="icon-park-outline:expand-right" />
        </UiButton>
      </div>
      <div class="flex-1 overflow-hidden">
        <UiScrollArea class="h-full">
          <div :id="`peek-card-${id}`" class="py-2 px-3" />
        </UiScrollArea>
      </div>
    </UiCardContent>
  </UiCard>

  <Teleport :to="target" defer>
    <slot :peek="peek" />
  </Teleport>
</template>
