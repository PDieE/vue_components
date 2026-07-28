<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { reactiveOmit } from '@vueuse/core'
import type { PaginationPrevProps } from 'reka-ui'
import { PaginationPrev, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import type { ButtonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<
    PaginationPrevProps & {
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
  <PaginationPrev
    data-slot="pagination-previous"
    :class="
      cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-[6px] text-foreground-4 transition-colors hover:bg-[#f8fafc] hover:text-brand focus-visible:ring-[3px] focus-visible:ring-brand/20 focus-visible:outline-none disabled:pointer-events-none disabled:text-[#cbd5e1]',
        props.class,
      )
    "
    v-bind="forwarded"
  >
    <slot>
      <Icon class="size-4" icon="icon-park-outline:left" />
      <span class="sr-only">Previous page</span>
    </slot>
  </PaginationPrev>
</template>
