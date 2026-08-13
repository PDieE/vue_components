import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

export { default as Tag } from './Tag.vue'

export const tagVariants = cva(
  'inline-flex shrink-0 items-center gap-1.5 overflow-hidden h-6 px-2 text-xs font-medium whitespace-nowrap',
  {
    variants: {
      color: {
        default: 'border-border bg-[#F1F5F9] text-foreground-4',
        blue: 'border-blue-border bg-blue text-blue-foreground',
        success: 'border-success-border bg-success text-success-foreground',
        warning: 'border-warning-border bg-warning text-warning-foreground',
        purple: 'border-purple-border bg-purple text-purple-foreground',
        error: 'border-error-border bg-error text-error-foreground',
      },
      shape: {
        square: 'rounded-md',
        round: 'rounded-full',
      },
      border: {
        true: 'border',
        false: '',
      },
    },
    defaultVariants: {
      color: 'default',
      shape: 'square',
      border: false,
    },
  },
)

export type TagVariants = VariantProps<typeof tagVariants>

export interface TagProps extends PrimitiveProps {
  class?: HTMLAttributes['class']
  color?: TagVariants['color']
  shape?: TagVariants['shape']
  border?: TagVariants['border']
  dot?: boolean
}

/** 映射选项 */
export interface MapOption {
  /** 显示文本 */
  label: string
  /** 值 */
  value: string | null | number
  /** 颜色，目前主要用于Tag */
  color?: 'blue' | 'success' | 'purple' | 'error' | 'default' | 'warning'
}

/** 映射选项值 */
export type MapOptionValue = string | number | boolean | null | undefined
