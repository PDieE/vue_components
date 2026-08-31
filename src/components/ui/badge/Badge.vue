<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import { Primitive } from 'reka-ui'

import { cn } from '@/lib/utils'

import type { BadgeProps } from '.'
import { badgeVariants } from '.'

const props = withDefaults(defineProps<BadgeProps>(), {
  shape: 'round',
})

const delegatedProps = reactiveOmit(props, 'class', 'shape', 'count', 'variant')
</script>

<template>
  <Primitive
    data-slot="badge"
    :class="
      cn(
        badgeVariants({ variant }),
        props.shape === 'round' && 'rounded-full',
        props.shape === 'square' && 'rounded',
        props.class,
      )
    "
    v-bind="delegatedProps"
  >
    <slot v-if="$slots.default" />
    <template v-else-if="count">
      {{ count > 99 ? '99+' : count }}
    </template>
  </Primitive>
</template>
