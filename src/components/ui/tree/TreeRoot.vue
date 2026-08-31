<script
  setup
  lang="ts"
  generic="T extends Record<string, any>, U extends Record<string, any>, M extends boolean = false"
>
import { omit } from 'es-toolkit'
import type { TreeRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const modelValue = defineModel<M extends true ? U[] : U>()
const expanded = defineModel<string[]>('expanded')
const props = defineProps<
  Omit<TreeRootProps<T, U, M>, 'modelValue' | 'expanded'> & {
    class?: HTMLAttributes['class']
  }
>()
</script>

<template>
  <RkTreeRoot
    v-slot="slots"
    v-bind="omit(props, ['class'])"
    v-model="modelValue"
    v-model:expanded="expanded"
    :class="cn('w-full bg-white space-y-1', props.class)"
  >
    <slot v-bind="slots" />
  </RkTreeRoot>
</template>
