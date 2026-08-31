<script setup lang="ts">
import { pick } from 'es-toolkit'
import type { TooltipContentProps, TooltipProviderProps, TooltipRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const { content, contentProps, defaultOpen, ...props } = defineProps<
  Omit<TooltipProviderProps, 'content'> &
    Pick<TooltipRootProps, 'defaultOpen'> & {
      /** 提示内容，优先级低于默认插槽 */
      content?: string
      contentProps?: TooltipContentProps & { class?: HTMLAttributes['class'] }
    }
>()
</script>

<template>
  <UiTooltipProvider
    v-bind="
      pick(props, [
        'delayDuration',
        'disableClosingTrigger',
        'disabled',
        'disableHoverableContent',
        'ignoreNonKeyboardFocus',
        'skipDelayDuration',
      ])
    "
  >
    <UiTooltip :default-open="defaultOpen">
      <UiTooltipTrigger as-child><slot name="trigger" /></UiTooltipTrigger>
      <UiTooltipContent v-bind="contentProps">
        <slot>{{ content }}</slot>
      </UiTooltipContent>
    </UiTooltip>
  </UiTooltipProvider>
</template>
