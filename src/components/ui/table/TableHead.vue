<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <th
    data-slot="table-head"
    :class="
      cn(
        'h-[48px] border-y-[0.5px] border-separator bg-[#f8fafc] px-4 py-[9px] text-left align-middle text-sm leading-[22px] font-normal whitespace-nowrap text-foreground-2 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        props.class,
      )
    "
  >
    <slot></slot>
  </th>
</template>
