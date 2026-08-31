<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { shallowRef } from 'vue'
import { watchEffect } from 'vue'

import { useInjectPeekPanel } from './context'

const { title = '', width = 220 } = defineProps<{
  /** 标题 */
  title?: string
  /** 宽度 */
  width?: number
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const { id, peek } = useInjectPeekPanel()!
const open = shallowRef(false)
watchEffect(() => {
  // 用来解决关闭后延迟触发了打开
  if (!peek.value && open.value) open.value = false
})
</script>

<template>
  <UiHoverCard v-model:open="open">
    <UiHoverCardTrigger as-child>
      <UiButton v-show="peek" variant="ghost" size="icon-xs" @click="peek = !peek">
        <icon class="text-foreground-2" icon="icon-park-outline:expand-left" />
      </UiButton>
    </UiHoverCardTrigger>
    <UiHoverCardContent
      class="p-0 rounded-2xl data-[state=open]:block data-[state=closed]:hidden data-[state=closed]:pointer-events-none"
      :style="{ width: `${width}px` }"
      side="left"
      align="start"
      forceMount
    >
      <div class="flex items-center border-b px-4 py-5">
        <UiCardTitle class="flex-1 truncate">{{ title }}</UiCardTitle>
      </div>
      <UiScrollArea class="h-[calc(100vh-300px)]">
        <div :id="`peek-hover-${id}`" class="py-2 px-3" />
      </UiScrollArea>
    </UiHoverCardContent>
  </UiHoverCard>
</template>
