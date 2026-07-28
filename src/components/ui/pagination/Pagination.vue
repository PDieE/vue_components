<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import type { PaginationRootEmits, PaginationRootProps } from 'reka-ui'
import { PaginationRoot, useForwardPropsEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<
    PaginationRootProps & {
      class?: HTMLAttributes['class']
    }
  >(),
  { showEdges: true, siblingCount: 1 },
)
const emits = defineEmits<PaginationRootEmits>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <PaginationRoot
    v-slot="slotProps"
    data-slot="pagination"
    v-bind="forwarded"
    :class="cn('flex w-full justify-end', props.class)"
  >
    <slot v-bind="slotProps"></slot>
  </PaginationRoot>
</template>
