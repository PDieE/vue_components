<script setup lang="ts">
import { ChevronLeftIcon } from '@lucide/vue'
import { reactiveOmit } from '@vueuse/core'
import type { PaginationFirstProps } from 'reka-ui'
import { PaginationFirst, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import type { ButtonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<
    PaginationFirstProps & {
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
  <PaginationFirst
    data-slot="pagination-first"
    :class="
      cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-[6px] p-2.5 text-foreground-4 transition-colors hover:bg-[#f8fafc] hover:text-brand focus-visible:ring-[3px] focus-visible:ring-brand/20 focus-visible:outline-none disabled:pointer-events-none disabled:text-[#cbd5e1]',
        props.class,
      )
    "
    v-bind="forwarded"
  >
    <slot>
      <ChevronLeftIcon class="size-3" />
      <span class="sr-only">First page</span>
    </slot>
  </PaginationFirst>
</template>
