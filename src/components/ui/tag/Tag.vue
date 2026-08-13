<script setup lang="ts">
import { cva } from 'class-variance-authority'
import { Primitive } from 'reka-ui'

import { cn } from '@/lib/utils'

import type { TagProps } from '.'
import { tagVariants } from '.'

const props = withDefaults(defineProps<TagProps>(), {
  as: 'span',
})

const dotVariants = cva('', {
  variants: {
    color: {
      default: 'bg-[#C9CDD4]',
      blue: 'bg-blue-foreground',
      success: 'bg-success-foreground',
      warning: 'bg-warning-foreground',
      purple: 'bg-purple-foreground',
      error: 'bg-error-foreground',
    },
  },
  defaultVariants: {
    color: 'default',
  },
})
</script>

<template>
  <Primitive
    data-slot="tag"
    :data-color="color"
    :data-shape="shape"
    :as="as"
    :as-child="asChild"
    :class="cn(tagVariants({ color, shape, border }), props.class)"
  >
    <div v-if="props.dot" class="size-1.5 rounded-full" :class="dotVariants({ color })"></div>
    <slot></slot>
  </Primitive>
</template>
