<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import type { PaginationListItemProps } from 'reka-ui'
import { PaginationListItem } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import type { ButtonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<
    PaginationListItemProps & {
      size?: ButtonVariants['size']
      class?: HTMLAttributes['class']
      isActive?: boolean
    }
  >(),
  {
    size: 'icon',
  },
)

const delegatedProps = reactiveOmit(props, 'class', 'size', 'isActive')
</script>

<template>
  <PaginationListItem
    data-slot="pagination-item"
    v-bind="delegatedProps"
    :class="
      cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-md p-1 font-[Nunito_Sans] text-sm leading-5.5 font-semibold text-foreground-4 transition-colors  hover:text-brand focus-visible:ring-[3px] focus-visible:ring-brand/20 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[selected=true]:bg-brand-bg data-[selected=true]:text-brand aria-[current=page]:bg-brand-bg aria-[current=page]:text-brand',
        !isActive && 'hover:bg-hover',
        isActive && 'bg-brand-bg text-brand hover:bg-brand-bg-hover',
        props.class,
      )
    "
  >
    <slot></slot>
  </PaginationListItem>
</template>
