<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div
    data-slot="sheet-footer"
    :class="cn('mt-auto flex justify-end gap-2.5 px-8 py-6 border-t border-separator', props.class)"
  >
    <slot />
  </div>
</template>
