<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { cn } from '@/lib/utils'

import { iconBoxColorVariants, type IconBoxColor } from '.'

const {
  size = 'default',
  color = 'default',
  icon,
  iconClass,
  iconBgClass,
} = defineProps<{
  /** 尺寸 */
  size?: 'default' | 'sm'
  /** 图标与背景的配色 */
  color?: IconBoxColor
  /** 图标名称 */
  icon?: string
  /** 图标类名 */
  iconClass?: string
  /** 图标背景类名 */
  iconBgClass?: string
}>()

/** 当前配色 */
const colorClasses = computed(() => iconBoxColorVariants[color])
</script>

<template>
  <div
    :class="
      cn(
        colorClasses.background,
        colorClasses.foreground,
        'shrink-0 rounded-xl flex items-center justify-center',
        { default: 'size-12', sm: 'size-10' }[size],
        iconBgClass,
      )
    "
  >
    <slot>
      <Icon
        v-if="icon"
        :class="cn({ default: 'size-6', sm: 'size-5' }[size], iconClass)"
        :icon="icon"
      />
    </slot>
  </div>
</template>
