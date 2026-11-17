<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { cn } from '@/lib/utils'

import type { ButtonProps } from '.'
import { buttonVariants } from '.'

const props = withDefaults(defineProps<ButtonProps>(), {
  as: 'button',
  loading: false,
  disabled: false,
  block: false,
  wide: false,
})
</script>

<template>
  <Primitive
    data-slot="button"
    :data-variant="variant"
    :data-theme="theme"
    :data-size="size"
    :as="as"
    :as-child="asChild"
    :class="
      cn(
        buttonVariants({ variant, size, theme }),
        props.block && 'flex w-full',
        props.wide && 'min-w-20',
        props.class,
      )
    "
    :disabled="props.disabled || props.loading ? true : undefined"
  >
    <UiSpinner v-if="props.loading" />
    <slot v-else name="icon"></slot>
    <slot></slot>
  </Primitive>
</template>
