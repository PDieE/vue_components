<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <tfoot
    data-slot="table-footer"
    :class="
      cn(
        'border-t-[0.5px] border-separator bg-[#f8fafc] text-foreground-4 [&>tr]:last:border-b-0',
        props.class,
      )
    "
  >
    <slot></slot>
  </tfoot>
</template>
