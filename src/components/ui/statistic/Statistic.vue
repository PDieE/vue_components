<script setup lang="ts">
import { IconBox, iconBoxColorVariants, type IconBoxColor } from '@/components/ui/icon-box'
import { cn } from '@/lib/utils'

const {
  size = 'default',
  title,
  subTitle,
  value,
  loading = false,
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
  title?: string
  /** 子标题 */
  subTitle?: string
  /** 数值 */
  value?: number | string
  /** 是否显示数值加载状态 */
  loading?: boolean
  /** 单位 */
  unit?: string
  /** 是否匹配图标背景颜色 */
  matchIconBg?: boolean
  /** 图标名称 */
  icon?: string
  /** 图标类名 */
  iconClass?: string
  /** 图标与背景的配色 */
  color?: IconBoxColor
  /** 图标背景颜色类名 */
  iconBgClass?: string
}>()

/** 数值文本 */
const valueText = computed(() => {
  // 千分位
  if (typeof value === 'number') return value.toLocaleString()
  if (typeof value === 'string' && /^\d+$/.test(value))
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  if (!value) return '-'
  return String(value)
})
/** 当前配色 */
const colorClasses = computed(() => iconBoxColorVariants[color])
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
          <slot name="title">{{ title }}</slot>
        </div>
        <div class="text-2xl text-foreground font-bold truncate" :aria-busy="loading">
          <UiSpinner v-if="loading" class="inline-block align-middle" />
          <template v-else>
            <slot name="value">{{ valueText }}</slot>
            <span v-if="unit" class="text-sm font-normal ml-0.5">{{ unit }}</span>
          </template>
        </div>
      </div>
      <IconBox
        v-if="icon || $slots.icon"
        :icon="icon"
        :size="size"
        :color="color"
        :icon-class="iconClass"
        :icon-bg-class="iconBgClass"
      >
        <template v-if="$slots.icon" #default>
          <slot name="icon" />
        </template>
      </IconBox>
    </div>
    <div v-if="subTitle" class="text-xs text-foreground-2 leading-5 mt-2.5">{{ subTitle }}</div>
  </div>
</template>
