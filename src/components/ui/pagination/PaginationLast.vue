<script setup lang="ts">
import { ChevronRightIcon } from '@lucide/vue'
import { reactiveOmit } from '@vueuse/core'
import type { PaginationLastProps } from 'reka-ui'
import { PaginationLast, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import type { ButtonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<
    PaginationLastProps & {
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
  <PaginationLast
    data-slot="pagination-last"
    :class="
      cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-[6px] p-2.5 text-foreground-4 transition-colors hover:bg-[#f8fafc] hover:text-brand focus-visible:ring-[3px] focus-visible:ring-brand/20 focus-visible:outline-none disabled:pointer-events-none disabled:text-[#cbd5e1]',
        props.class,
      )
    "
    v-bind="forwarded"
  >
    <slot>
      <ChevronRightIcon class="size-3" />
      <span class="sr-only">Last page</span>
    </slot>
  </PaginationLast>
</template>
