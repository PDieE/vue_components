<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    tableLayout?: 'auto' | 'fixed'
  }>(),
  { tableLayout: 'auto' },
)
</script>

<template>
  <div data-slot="table-container" class="relative w-full">
    <table
      data-slot="table"
      :class="
        cn(
          'w-full border-collapse caption-bottom text-sm text-foreground-4',
          props.tableLayout === 'fixed' ? 'table-fixed' : '',
          props.class,
        )
      "
    >
      <slot></slot>
    </table>
  </div>
</template>
