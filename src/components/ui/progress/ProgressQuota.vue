<script setup lang="ts">
import { computed } from 'vue'

const {
  total,
  current,
  threshold = 100,
} = defineProps<{
  /** 总量 */
  total: number
  /** 当前 */
  current: number
  /** 阈值 */
  threshold?: number
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const progress = computed(() => {
  if (total <= 0) return 0
  return (Math.min(Math.max(current, 0), total) / total) * 100
})
</script>

<template>
  <div class="">
    <div class="text-foreground-4 text-xs mb-1">{{ current }}/{{ total }}</div>
    <UiProgress
      class="h-1.5"
      :modelValue="progress"
      :color="total >= threshold ? 'error' : 'brand'"
    />
  </div>
</template>
