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
    data-slot="tabs-list-button"
    v-bind="delegatedProps"
    :class="
      cn(
        'relative isolate inline-flex w-fit items-center overflow-visible rounded-lg bg-hover p-[3px] text-sm leading-[22px] font-medium text-foreground-2',
        props.class,
      )
    "
  >
    <slot />
    <TabsIndicator
      as="span"
      class="pointer-events-none absolute top-[3px] bottom-[3px] left-0 z-0 rounded-md bg-white shadow-[0_2px_1px_0_#dee3ee] transition-[width,transform,opacity] duration-200 ease-out"
      style="
        width: var(--reka-tabs-indicator-size);
        transform: translateX(var(--reka-tabs-indicator-position));
      "
    />
  </TabsList>
</template>
