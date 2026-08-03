import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { HTMLAttributes } from 'vue'

export { default as Empty } from './Empty.vue'
export { default as EmptyContent } from './EmptyContent.vue'
export { default as EmptyDescription } from './EmptyDescription.vue'
export { default as EmptyHeader } from './EmptyHeader.vue'
export { default as EmptyMedia } from './EmptyMedia.vue'
export { default as EmptyTitle } from './EmptyTitle.vue'
export { default as EmptyApp } from './EmptyApp.vue'

export const emptyMediaVariants = cva(
  'mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type EmptyMediaVariants = VariantProps<typeof emptyMediaVariants>

/** 空状态应用组件属性 */
export interface EmptyAppProps {
  class?: HTMLAttributes['class']
  /** 标题文本 */
  title?: string
  /** 描述文本 */
  description?: string
  /** 图标变体 */
  mediaVariant?: EmptyMediaVariants['variant']
}
