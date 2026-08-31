<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import type { RangeCalendarCellTriggerProps } from 'reka-ui'
import { RangeCalendarCellTrigger, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<RangeCalendarCellTriggerProps & { class?: HTMLAttributes['class'] }>(),
  {
    as: 'button',
  },
)

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <RangeCalendarCellTrigger
    data-slot="range-calendar-trigger"
    :class="
      cn(
        buttonVariants({ variant: 'ghost' }),
        'h-8 w-8 p-0 font-normal data-[selected]:opacity-100',
        '[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground',
        // Selection Start
        'data-[selection-start]:bg-brand data-[selection-start]:text-primary-foreground [&[data-selection-start]:hover]:bg-brand-hover data-[selection-start]:hover:text-primary-foreground data-[selection-start]:focus:bg-brand data-[selection-start]:focus:text-primary-foreground',
        // Selection End
        'data-[selection-end]:bg-brand data-[selection-end]:text-primary-foreground [&[data-selection-end]:hover]:bg-brand-hover data-[selection-end]:hover:text-primary-foreground data-[selection-end]:focus:bg-brand data-[selection-end]:focus:text-primary-foreground',
        // Outside months
        'data-[outside-view]:text-muted-foreground',
        // Disabled
        'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
        // Unavailable
        'data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through',
        props.class,
      )
    "
    v-bind="forwardedProps"
  >
    <slot />
  </RangeCalendarCellTrigger>
</template>
