<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { cn } from '@/lib/utils'

/** 预制色 */
type PresetColor =
  | 'default'
  | 'blue'
  | 'success'
  | 'cyan'
  | 'indigo'
  | 'warning'
  | 'purple'
  | 'error'

const {
  size = 'default',
  title,
  subTitle,
  value,
  unit,
  matchIconBg = false,
  icon,
  iconClass,
  color = 'default',
  iconBgClass,
} = defineProps<{
  /** 尺寸 */
  size?: 'default' | 'sm'
  /** 标题 */
  title: string
  /** 子标题 */
  subTitle?: string
  /** 数值 */
  value?: number | string
  /** 单位 */
  unit?: string
  /** 是否匹配图标背景颜色 */
  matchIconBg?: boolean
  /** 图标名称 */
  icon?: string
  /** 图标类名 */
  iconClass?: string
  /** 图标与背景的配色 */
  color?: PresetColor
  /** 图标背景颜色类名 */
  iconBgClass?: string
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
/** 数值文本 */
const valueText = computed(() => {
  // 千分位
  if (typeof value === 'number') return value.toLocaleString()
  if (typeof value === 'string' && /^\d+$/.test(value))
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  if (!value) return '-'
  return String(value)
})
/** Figma 配色：背景与图标颜色成对切换，仅用于本组件。 */
const colorVariants = {
  default: { background: 'bg-layout', foreground: 'text-foreground-3' },
  success: { background: 'bg-[#ECFDF5]', foreground: 'text-[#16A34A]' },
  blue: { background: 'bg-[#EFF6FF]', foreground: 'text-[#2563EB]' },
  cyan: { background: 'bg-[rgba(224,255,248,0.75)]', foreground: 'text-[#0AA5A8]' },
  indigo: { background: 'bg-[#EEF2FF]', foreground: 'text-[#4F46E5]' },
  warning: { background: 'bg-[#FFFBEB]', foreground: 'text-[#D97706]' },
  purple: { background: 'bg-[#F7EFFF]', foreground: 'text-[#9333EA]' },
  error: { background: 'bg-[#FEF2F2]', foreground: 'text-[#DC2626]' },
} satisfies Record<PresetColor, { background: string; foreground: string }>

const colorClasses = computed(() => colorVariants[color])
</script>

<template>
  <div
    :class="
      cn(
        'rounded-2xl bg-layout',
        { default: 'p-6', sm: 'p-4' }[size],
        matchIconBg && colorClasses.background,
      )
    "
  >
    <div class="flex items-center gap-2">
      <div class="flex-1">
        <div
          :class="[
            'text-foreground-4 leading-5.5 mb-1 truncate',
            { default: 'text-sm', sm: 'text-xs' }[size],
          ]"
        >
          {{ title }}
        </div>
        <div class="text-2xl text-foreground font-bold truncate">
          <slot name="value">{{ valueText }}</slot>
          <span v-if="unit" class="text-sm font-normal">{{ unit }}</span>
        </div>
      </div>
      <div
        v-if="icon || $slots.icon"
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
        <slot name="icon">
          <Icon
            v-if="icon"
            :class="cn({ default: 'size-6', sm: 'size-5' }[size], iconClass)"
            :icon="icon"
          />
        </slot>
      </div>
    </div>
    <div v-if="subTitle" class="text-xs text-foreground-2 leading-5 mt-2.5">{{ subTitle }}</div>
  </div>
</template>
