<script setup lang="ts">
import { MoreHorizontal } from '@lucide/vue'
import { reactiveOmit } from '@vueuse/core'
import type { PaginationEllipsisProps } from 'reka-ui'
import { PaginationEllipsis } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<PaginationEllipsisProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <PaginationEllipsis
    data-slot="pagination-ellipsis"
    v-bind="delegatedProps"
    :class="
      cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-[6px] p-2.5 text-foreground-4',
        props.class,
      )
    "
  >
    <slot>
      <MoreHorizontal class="size-3" />
      <span class="sr-only">More pages</span>
    </slot>
  </PaginationEllipsis>
</template>
