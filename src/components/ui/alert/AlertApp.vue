<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type { AlertVariants } from '.'

const { variant, icon, title, description } = defineProps<{
  variant?: AlertVariants['variant']
  /** 图标 */
  icon?: string
  /** 标题 */
  title?: string
  /** 描述 */
  description?: string
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const iconName = computed(() => {
  if (icon) return icon
  const icons: Record<string, string> = {
    info: 'icon-park-solid:info',
    success: 'icon-park-solid:check-one',
    warning: 'icon-park-solid:attention',
    destructive: 'icon-park-solid:close-one',
  }
  return icons[variant || '']
})
</script>

<template>
  <UiAlert :variant="variant">
    <slot v-if="iconName || $slots.icon" name="icon">
      <Icon v-if="iconName" :icon="iconName" />
    </slot>
    <UiAlertTitle v-if="title || $slots.title">
      <slot name="title">{{ title }}</slot>
    </UiAlertTitle>
    <UiAlertDescription v-if="description || $slots.description">
      <slot name="description">{{ description }}</slot>
    </UiAlertDescription>
  </UiAlert>
</template>
