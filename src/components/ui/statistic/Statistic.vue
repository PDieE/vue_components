<!-- 上传组件 -->
<template>
  <div class="p-6 rounded-2xl bg-layout">
    <div class="flex items-center">
      <div class="flex-1">
        <div class="text-sm text-foreground-4 leading-5.5 mb-1 truncate">{{ title }}</div>
        <div class="text-2xl text-foreground font-bold truncate">
          {{ valueText }}
          <span v-if="unit" class="text-sm font-normal">{{ unit }}</span>
        </div>
      </div>
      <div
        v-if="icon || $slots.icon"
        :class="
          cn(
            iconBg &&
              ['blue', 'success', 'purple', 'error', 'default', 'warning'].includes(iconBg) &&
              iconBgVariants({ iconBg: iconBg, iconBgGradient: iconBgGradient }),
            'size-12 rounded-xl flex items-center justify-center',
            iconBgClass,
          )
        "
      >
        <slot name="icon">
          <Icon v-if="icon" :class="cn('size-6 text-white', iconClass)" :icon="icon" />
        </slot>
      </div>
    </div>
    <div v-if="subTitle" class="text-xs text-foreground-2 leading-5 mt-2.5">{{ subTitle }}</div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

type PresetColor = 'blue' | 'success' | 'purple' | 'error' | 'default' | 'warning'
export type IconBgVariants = VariantProps<typeof iconBgVariants>
const {
  title,
  subTitle,
  value,
  unit,
  icon,
  iconClass,
  iconBg,
  iconBgClass,
  iconBgGradient = false,
} = defineProps<{
  /** 标题 */
  title: string
  /** 子标题 */
  subTitle?: string
  /** 数值 */
  value?: number | string
  /** 单位 */
  unit?: string
  /** 图标名称 */
  icon?: string
  /** 图标类名 */
  iconClass?: string
  /** 图标背景颜色 */
  iconBg?: PresetColor
  /** 图标背景颜色是否渐变 */
  iconBgGradient?: IconBgVariants['iconBgGradient']
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
const iconBgVariants = cva('', {
  variants: {
    iconBg: {
      default: '',
      blue: 'bg-blue-foreground',
      success: 'bg-success-foreground',
      warning: 'bg-warning-foreground',
      purple: 'bg-purple-foreground',
      error: 'bg-error-foreground',
    },
    iconBgGradient: { true: '', false: '' },
  },
  compoundVariants: [
    {
      iconBg: 'blue',
      iconBgGradient: true,
      class: 'bg-[linear-gradient(180deg,#206CCF_0%,#6BA6FF_100%)]',
    },
    {
      iconBg: 'success',
      iconBgGradient: true,
      class: 'bg-[linear-gradient(180deg,#0DB2AF_0%,#07C6C2_100%)]',
    },
    {
      iconBg: 'warning',
      iconBgGradient: true,
      class: 'bg-[linear-gradient(180deg,#FF793B_0%,#FFA894_100%)]',
    },
    {
      iconBg: 'purple',
      iconBgGradient: true,
      class: 'bg-[linear-gradient(180deg,#722ED1_0%,#922ED1_100%)]',
    },
    {
      iconBg: 'error',
      iconBgGradient: true,
      class: 'bg-[linear-gradient(180deg,#FF455D_0%,#FF7D84_100%)]',
    },
  ],
  defaultVariants: {
    iconBg: 'default',
  },
})
</script>
