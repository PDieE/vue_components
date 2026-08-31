<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const { jump = false, ...props } = defineProps<{
  class?: HTMLAttributes['class']
  /** 是否展示跳转图标 */
  jump?: boolean
}>()
</script>

<template>
  <a
    data-slot="link"
    :class="
      cn(
        'cursor-pointer whitespace-nowrap rounded-md p-0 text-sm font-normal text-brand underline-offset-4',
        'transition-all hover:underline aria-disabled:pointer-events-none aria-disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'max-w-full inline-flex items-center gap-1',
        props.class,
      )
    "
  >
    <template v-if="jump">
      <span class="truncate"><slot></slot></span
      ><icon class="text-sm shrink-0" icon="icon-park-outline:share" />
    </template>
    <slot v-else></slot>
  </a>
</template>
