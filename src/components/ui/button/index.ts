import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  "inline-flex align-middle items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-normal transition-all disabled:pointer-events-none disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: '',
        secondary: '',
        outline: 'border',
        ghost: '',
        text: '',
        link: 'underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-8 px-3 py-2 has-[>svg]:px-3',
        xs: "h-6 rounded-md gap-1 px-1.5 text-xs has-[>svg]:px-1 [&_svg:not([class*='size-'])]:size-3.5",
        sm: 'h-7 rounded-md gap-1.5 px-2.5 has-[>svg]:px-2',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        action: 'h-6 rounded-md gap-1 px-1 has-[>svg]:px-1',
        icon: 'size-8',
        'icon-xs': "size-6 [&_svg:not([class*='size-'])]:size-3.5",
        'icon-sm': 'size-7',
        'icon-lg': 'size-10',
      },
      theme: { default: '', destructive: '', brand: '' },
    },
    compoundVariants: [
      {
        variant: ['default', 'secondary', 'outline'],
        theme: 'default',
        class: 'active:ring-3 active:ring-primary/10',
      },
      {
        variant: 'default',
        theme: 'default',
        class: 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50',
      },
      {
        variant: 'secondary',
        theme: 'default',
        class: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50',
      },
      {
        variant: 'outline',
        theme: 'default',
        class:
          'border-input text-foreground-4 hover:bg-layout disabled:text-foreground-3 dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
      },
      {
        variant: 'ghost',
        theme: 'default',
        class:
          'hover:bg-accent hover:text-accent-foreground disabled:opacity-50 dark:hover:bg-accent/50',
      },
      {
        variant: 'link',
        theme: 'default',
        class: 'text-primary disabled:opacity-50',
      },
      {
        variant: 'text',
        theme: 'default',
        class: 'text-primary hover:text-primary/80 disabled:opacity-50',
      },
      {
        variant: ['default', 'secondary', 'outline'],
        theme: 'brand',
        class: 'active:ring-3 active:ring-brand-bg-hover',
      },
      {
        variant: 'default',
        theme: 'brand',
        class: 'bg-brand text-white hover:bg-brand-hover disabled:bg-brand-disable',
      },
      {
        variant: 'secondary',
        theme: 'brand',
        class:
          'bg-secondary text-secondary-foreground hover:bg-input disabled:bg-[#F7F8FA] disabled:text-foreground-3',
      },
      {
        variant: 'outline',
        theme: 'brand',
        class:
          'border-brand text-brand hover:bg-brand-bg hover:text-brand disabled:border-brand-disable disabled:text-brand-disable',
      },
      {
        variant: 'ghost',
        theme: 'brand',
        class: 'text-brand hover:bg-[#F2F3F5] hover:text-brand disabled:text-brand-disable',
      },
      {
        variant: 'link',
        theme: 'brand',
        class: 'text-brand disabled:text-brand-disable',
      },
      {
        variant: 'text',
        theme: 'brand',
        class: 'text-brand hover:text-brand-active disabled:text-brand-disable',
      },
      {
        variant: ['default', 'outline', 'secondary'],
        theme: 'destructive',
        class: 'active:ring-3 active:ring-destructive/20 dark:active:ring-destructive/40',
      },
      {
        variant: 'default',
        theme: 'destructive',
        class:
          'bg-destructive text-white hover:bg-[#F76560] disabled:bg-[#FBACA3] dark:bg-destructive/60',
      },
      {
        variant: 'secondary',
        theme: 'destructive',
        class: 'bg-error text-destructive hover:bg-[#FDCDC5] disabled:bg-#FFECE8',
      },
      {
        variant: 'outline',
        theme: 'destructive',
        class:
          'border-destructive text-destructive hover:bg-error disabled:border-[#FBACA3] disabled:text-[#FBACA3]  dark:hover:bg-destructive/20',
      },
      {
        variant: 'ghost',
        theme: 'destructive',
        class:
          'text-destructive hover:bg-[#F2F3F5] disabled:text-[#FBACA3] dark:hover:bg-destructive/20',
      },
      {
        variant: 'link',
        theme: 'destructive',
        class: 'text-destructive disabled:text-error-disable',
      },
      {
        variant: 'text',
        theme: 'destructive',
        class: 'text-destructive hover:text-error-hover  disabled:text-error-disable',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      theme: 'default',
    },
  },
)
export type ButtonVariants = VariantProps<typeof buttonVariants>

export interface ButtonProps extends PrimitiveProps {
  class?: HTMLAttributes['class']
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  theme?: ButtonVariants['theme']
  loading?: boolean
  disabled?: boolean
  /** 块级按钮 */
  block?: boolean
}
