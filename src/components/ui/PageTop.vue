<script setup lang="ts">
import { Icon } from '@iconify/vue'

const { icon, title, desc } = defineProps<{
  icon?: string
  /** 标题 */
  title: string
  /** 描述 */
  desc?: string
}>()
</script>

<template>
  <div class="flex">
    <div class="flex-1">
      <div class="flex gap-3 items-center">
        <Icon v-if="icon" class="text-brand size-6" :icon="icon" />
        <div class="text-2xl font-semibold text-foreground">{{ title }}</div>
      </div>
      <div v-if="desc" class="mt-1 text-sm text-foreground-2">{{ desc }}</div>
    </div>
    <slot name="right"></slot>
  </div>
</template>
