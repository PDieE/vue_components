<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <caption
    data-slot="table-caption"
    :class="cn('mt-4 text-sm leading-[22px] text-foreground-2', props.class)"
  >
    <slot></slot>
  </caption>
</template>
