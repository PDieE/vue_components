<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <tr
    data-slot="table-row"
    :class="
      cn(
        'h-[60px] border-b-[0.5px] border-separator transition-colors hover:bg-[#f8fafc]/60 data-[state=selected]:bg-[#f8fafc]',
        props.class,
      )
    "
  >
    <slot></slot>
  </tr>
</template>
