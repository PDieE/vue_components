<script setup lang="ts">
import { useUiLocale } from '@/components/ui/config-provider'

import type { AlertDialogAppProps } from '.'
import AlertDialog from './AlertDialog.vue'
import AlertDialogAction from './AlertDialogAction.vue'
import AlertDialogCancel from './AlertDialogCancel.vue'
import AlertDialogContent from './AlertDialogContent.vue'
import AlertDialogDescription from './AlertDialogDescription.vue'
import AlertDialogFooter from './AlertDialogFooter.vue'
import AlertDialogHeader from './AlertDialogHeader.vue'
import AlertDialogTitle from './AlertDialogTitle.vue'
import AlertDialogTrigger from './AlertDialogTrigger.vue'

defineOptions({ inheritAttrs: false })

const { t } = useUiLocale()

const open = defineModel<boolean>('open', { default: false })
const {
  title,
  description,
  confirmText,
  cancelText,
  confirmTheme = 'brand',
  closeOnEscape = true,
} = defineProps<AlertDialogAppProps>()

const emits = defineEmits<{
  open: []
  close: []
  /** 点击确认按钮时触发 */
  confirm: [event: MouseEvent]
  cancel: [event: MouseEvent]
}>()

/**
 * 打开状态改变时触发对应事件。
 * @param value 是否打开
 */
function openChange(value: boolean) {
  if (value) emits('open')
  else emits('close')
}
</script>

<template>
  <AlertDialog v-model:open="open" @update:open="openChange">
    <AlertDialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </AlertDialogTrigger>
    <AlertDialogContent
      v-bind="$attrs"
      :aria-describedby="description || $slots.description ? undefined : ''"
      @escape-key-down="
        (event) => {
          if (!closeOnEscape) event.preventDefault()
        }
      "
    >
      <AlertDialogHeader v-if="title || $slots.title || description || $slots.description">
        <AlertDialogTitle v-if="title || $slots.title">
          <slot name="title">{{ title }}</slot>
        </AlertDialogTitle>
        <AlertDialogDescription v-if="description || $slots.description">
          <slot name="description">{{ description }}</slot>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="emits('cancel', $event)">
          {{ cancelText ?? t('common.cancel') }}
        </AlertDialogCancel>
        <AlertDialogAction :theme="confirmTheme" @click="emits('confirm', $event)">
          {{ confirmText ?? t('common.confirm') }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
