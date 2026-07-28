<script setup lang="ts">
import { useInjectFilterForm } from './context'

const { mediaQuery = 'min-width: 0px' } = defineProps<{
  /** 超宽宽度 */
  mediaQuery?: string
}>()

onBeforeMount(() => {
  registerAction()
})
onBeforeUnmount(() => {
  registerAction(false)
})

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const { registerAction } = useInjectFilterForm()!
const compact = useMediaQuery(mediaQuery)
</script>

<template>
  <div ref="elRef" class="flex-1 justify-end flex flex-wrap items-center gap-2.5 overflow-hidden">
    <slot :compact="compact" />
  </div>
</template>
