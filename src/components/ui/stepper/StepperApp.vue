<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { omit } from 'es-toolkit'
import type { StepperRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const modelValue = defineModel<number>()
const props = defineProps<
  Omit<StepperRootProps, 'modelValue'> & {
    class?: HTMLAttributes['class']
    /** 步骤 */
    steps: { step: number; icon?: string; title?: string; description?: string }[]
  }
>()
const emits = defineEmits<{
  'update:modelValue': [v: number | undefined]
}>()
</script>

<template>
  <UiStepper
    v-bind="omit(props, ['class'])"
    :model-value="modelValue"
    @update:model-value="emits('update:modelValue', $event)"
    :class="cn('flex w-10/12 items-start gap-2 mx-auto', props.class)"
  >
    <UiStepperItem
      v-for="item in props.steps"
      :key="item.step"
      :step="item.step"
      class="relative flex w-full flex-col items-center justify-center"
    >
      <UiStepperTrigger>
        <UiStepperIndicator v-slot="{ step }">
          <Icon v-if="item.icon" :icon="item.icon" class="size-4" />
          <span v-else>{{ step }}</span>
        </UiStepperIndicator>
      </UiStepperTrigger>
      <UiStepperSeparator
        v-if="item.step !== props.steps[props.steps.length - 1]?.step"
        class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full"
      />
      <div v-if="item.title || item.description" class="flex flex-col items-center">
        <UiStepperTitle v-if="item.title">{{ item.title }}</UiStepperTitle>
        <UiStepperDescription v-if="item.description">{{ item.description }}</UiStepperDescription>
      </div>
    </UiStepperItem>
  </UiStepper>
</template>
