<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import type { TabsListProps } from 'reka-ui'
import { TabsIndicator, TabsList } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <TabsList
    data-slot="tabs-list"
    v-bind="delegatedProps"
    :class="
      cn(
        'relative inline-flex w-fit items-start gap-8 overflow-visible bg-transparent p-0 text-sm leading-[22px] font-medium text-foreground-2',
        props.class,
      )
    "
  >
    <slot />
    <TabsIndicator
      as="span"
      class="pointer-events-none absolute bottom-0 left-0 h-[3px] rounded-t-[3px] bg-brand transition-[width,transform,opacity] duration-200 ease-out"
      style="
        width: var(--reka-tabs-indicator-size);
        transform: translateX(var(--reka-tabs-indicator-position));
      "
    />
  </TabsList>
</template>
