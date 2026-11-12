<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const { class: pClass, shadow = false } = defineProps<{
  class?: HTMLAttributes['class']
  /** 是否显示阴影 */
  shadow?: boolean
}>()
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'bg-card text-card-foreground flex flex-col gap-4 rounded-2xl border py-5',
        shadow ? 'shadow-sm' : '',
        pClass,
      )
    "
  >
    <slot></slot>
  </div>
</template>
