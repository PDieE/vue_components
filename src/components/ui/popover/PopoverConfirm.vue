<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { reactiveOmit } from '@vueuse/core'
import type { PopoverContentEmits, PopoverContentProps } from 'reka-ui'
import { useForwardPropsEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { computed, shallowRef } from 'vue'

import type { ButtonProps } from '@/components/ui/button'

const props = withDefaults(
  defineProps<
    PopoverContentProps & {
      /** 标题 */
      title?: string
      /** 内容 */
      content?: string
      /** 主题 */
      theme?: 'default' | 'warning' | 'destructive'
      /** 取消按钮 */
      cancelBtn?: ButtonProps
      /** 确认按钮 */
      confirmBtn?: ButtonProps
      /** 层级索引 */
      zIndex?: number
      class?: HTMLAttributes['class']
    }
  >(),
  { side: 'top', align: 'end', theme: 'default' },
)
const emits = defineEmits<
  PopoverContentEmits & {
    /** 取消 */
    cancel: []
    /** 确认 */
    confirm: []
  }
>()

const delegatedProps = reactiveOmit(
  props,
  'title',
  'content',
  'theme',
  'cancelBtn',
  'confirmBtn',
  'class',
)
const forwarded = useForwardPropsEmits(delegatedProps, emits)

const open = shallowRef(false)
const iconConfig = computed(() => {
  return {
    default: {
      icon: 'icon-park-solid:info',
      class: 'text-brand',
    },
    warning: {
      icon: 'icon-park-solid:attention',
      class: 'text-warning',
    },
    destructive: {
      icon: 'icon-park-solid:attention',
      class: 'text-destructive',
    },
  }[props.theme]
})
/** 取消 */
function cancel() {
  open.value = false
  emits('cancel')
}
/** 确认 */
function confirm() {
  open.value = false
  emits('confirm')
}
</script>

<template>
  <UiPopover v-model:open="open">
    <UiPopoverTrigger as-child>
      <slot></slot>
    </UiPopoverTrigger>
    <UiPopoverContent
      v-bind="forwarded"
      :class="props.class"
      :style="{ zIndex: props.zIndex ?? undefined }"
    >
      <div class="mb-2 flex gap-3">
        <Icon :icon="iconConfig.icon" :class="['size-4 mt-0.5 shrink-0', iconConfig.class]" />
        <div class="min-w-0 flex-1">
          <div v-if="title" class="text-sm text-foreground">
            {{ title }}
          </div>
          <div v-if="content" class="mt-1 text-sm text-muted-foreground">
            {{ content }}
          </div>
        </div>
      </div>
      <div class="text-right space-x-2">
        <UiButton v-bind="{ variant: 'outline', size: 'xs', ...cancelBtn }" @click="cancel">
          取消
        </UiButton>
        <UiButton v-bind="{ theme: 'brand', size: 'xs', ...confirmBtn }" @click="confirm">
          确认
        </UiButton>
      </div>
    </UiPopoverContent>
  </UiPopover>
</template>
