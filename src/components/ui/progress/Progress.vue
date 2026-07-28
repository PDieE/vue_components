<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import type { ProgressRootProps } from 'reka-ui'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<
    ProgressRootProps & { class?: HTMLAttributes['class']; color?: 'default' | 'brand' | 'error' }
  >(),
  {
    modelValue: 0,
    color: 'default',
  },
)

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <ProgressRoot
    data-slot="progress"
    v-bind="delegatedProps"
    :class="
      cn(
        'relative h-2 w-full overflow-hidden rounded-full',
        props.color === 'default' ? 'bg-primary/20' : '',
        props.color === 'brand' ? 'bg-brand-hover/5' : '',
        props.color === 'error' ? 'bg-error' : '',
        props.class,
      )
    "
  >
    <ProgressIndicator
      data-slot="progress-indicator"
      class="h-full w-full flex-1 transition-all"
      :class="[
        props.color === 'default' ? 'bg-primary' : '',
        props.color === 'brand' ? 'bg-brand-hover' : '',
        props.color === 'error' ? 'bg-error-foreground' : '',
      ]"
      :style="`transform: translateX(-${100 - (props.modelValue ?? 0)}%);`"
    />
  </ProgressRoot>
</template>
