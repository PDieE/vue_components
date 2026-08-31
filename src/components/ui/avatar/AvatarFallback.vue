<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import type { AvatarFallbackProps } from 'reka-ui'
import { AvatarFallback } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<
    AvatarFallbackProps & { class?: HTMLAttributes['class']; theme?: 'default' | 'brand' }
  >(),
  { theme: 'default' },
)

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <AvatarFallback
    data-slot="avatar-fallback"
    v-bind="delegatedProps"
    :class="
      cn(
        ' flex size-full items-center justify-center rounded-full',
        { default: ['bg-muted'], brand: ['bg-brand', 'text-white'] }[props.theme],
        props.class,
      )
    "
  >
    <slot></slot>
  </AvatarFallback>
</template>
