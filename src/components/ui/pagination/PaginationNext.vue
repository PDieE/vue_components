<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { reactiveOmit } from '@vueuse/core'
import type { PaginationNextProps } from 'reka-ui'
import { PaginationNext, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import type { ButtonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<
    PaginationNextProps & {
      size?: ButtonVariants['size']
      class?: HTMLAttributes['class']
    }
  >(),
  {
    size: 'default',
  },
)

const delegatedProps = reactiveOmit(props, 'class', 'size')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <PaginationNext
    data-slot="pagination-next"
    :class="
      cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-[6px] text-foreground-4 transition-colors hover:bg-[#f8fafc] hover:text-brand focus-visible:ring-[3px] focus-visible:ring-brand/20 focus-visible:outline-none disabled:pointer-events-none disabled:text-[#cbd5e1]',
        props.class,
      )
    "
    v-bind="forwarded"
  >
    <slot>
      <Icon class="size-4" icon="icon-park-outline:right" />
      <span class="sr-only">Next page</span>
    </slot>
  </PaginationNext>
</template>
