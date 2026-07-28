<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import type { TabsTriggerProps } from 'reka-ui'
import { TabsTrigger, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<TabsTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <TabsTrigger
    data-slot="tabs-trigger"
    :class="
      cn(
        'relative inline-flex h-[34px] shrink-0 items-start justify-center gap-1.5 rounded-[2px] pb-3 text-sm font-medium whitespace-nowrap text-foreground-2 transition-[color,background-color,box-shadow] hover:text-brand-hover focus-visible:ring-[3px] focus-visible:ring-brand/20 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-brand [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        props.class,
      )
    "
    v-bind="forwardedProps"
  >
    <slot />
  </TabsTrigger>
</template>
