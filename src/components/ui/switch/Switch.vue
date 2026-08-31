<script setup lang="ts" generic="TValue">
import { omit } from 'es-toolkit'
import type { SwitchRootEmits, SwitchRootProps } from 'reka-ui'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { type HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<
    SwitchRootProps<TValue> & {
      /** 是否加载中 */
      loading?: boolean
      class?: HTMLAttributes['class']
    }
  >(),
  { loading: false },
)

const emits = defineEmits<
  SwitchRootEmits<TValue> & {
    change: [checked: TValue]
  }
>()

function changed(checked: TValue) {
  emits('update:modelValue', checked)
  emits('change', checked)
}
</script>

<template>
  <SwitchRoot
    v-slot="slotProps"
    data-slot="switch"
    v-bind="omit(props, ['class', 'loading'])"
    :class="
      cn(
        'peer relative data-[state=checked]:bg-brand data-[state=unchecked]:bg-[#E5E7EB] focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-[#E5E7EB]/80 inline-flex h-4 w-7 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    "
    @update:model-value="changed"
  >
    <SwitchThumb
      data-slot="switch-thumb"
      :class="
        cn(
          'bg-white dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-3 rounded-full shadow-[0px_1px_3px_0px_rgba(0_0_0/0.10)]',
          'absolute transition-all data-[state=checked]:left-[calc(100%-14px)] data-[state=unchecked]:left-0.5',
        )
      "
    >
      <slot name="thumb" v-bind="slotProps" />
      <UiSpinner v-if="props.loading" class="size-3" />
    </SwitchThumb>
  </SwitchRoot>
</template>
