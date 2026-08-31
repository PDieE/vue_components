<template>
  <UiDialog v-model:open="open" @update:open="openChange">
    <UiDialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </UiDialogTrigger>
    <UiDialogContent
      class="max-w-screen!"
      :style="{ width: contentWidth }"
      :z-index="zIndex"
      :show-close-button="showCloseButton"
      @escape-key-down="
        (event) => {
          if (!closeOnEscape) event.preventDefault()
        }
      "
      @interact-outside="
        (event) => {
          if (!closeOnInteractOutside) event.preventDefault()
        }
      "
    >
      <UiDialogHeader v-if="title || $slots.title || description || $slots.description">
        <UiDialogTitle v-if="$slots.title"><slot name="title" /></UiDialogTitle>
        <UiDialogTitle v-else>{{ title }}</UiDialogTitle>
        <UiDialogDescription v-if="$slots.description">
          <slot name="description" />
        </UiDialogDescription>
        <UiDialogDescription v-else>{{ description }}</UiDialogDescription>
      </UiDialogHeader>
      <div class="flex-1 min-h-0 -mx-6 max-h-[calc(100vh-200px)]">
        <UiScrollArea class="h-full" :view-class="cn('px-6', bodyClass)">
          <slot />
        </UiScrollArea>
      </div>

      <UiDialogFooter v-if="$slots.footer">
        <slot name="footer" />
      </UiDialogFooter>
    </UiDialogContent>
  </UiDialog>
</template>

<script lang="ts" setup>
import { type HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const open = defineModel<boolean>('open', { default: false })
const {
  title,
  description,
  size,
  zIndex,
  showCloseButton = true,
  closeOnInteractOutside = true,
  closeOnEscape = true,
} = defineProps<{
  /** 宽度 */
  size?: number | string
  /** 层级索引 */
  zIndex?: number
  /** 标题 */
  title?: string
  /** 描述 */
  description?: string
  /** 是否显示关闭按钮，默认显示 */
  showCloseButton?: boolean
  /** 是否允许点击外部区域关闭，默认允许 */
  closeOnInteractOutside?: boolean
  /** 是否允许按 Escape 关闭，默认允许 */
  closeOnEscape?: boolean
  /** 内容区域class名 */
  bodyClass?: HTMLAttributes['class']
}>()
const emits = defineEmits<{
  /** 打开回调 */
  open: []
  /** 关闭回调 */
  close: []
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const contentWidth = computed(() => {
  if (!size) return '512px'

  if (typeof size === 'number') return `${size}px`

  if (String(Number(size)) === size) return `${size}px`

  return size
})
/**
 * 打开状态改变时触发
 * @param v 是否打开
 */
function openChange(v: boolean) {
  if (v) {
    emits('open')
    return
  }
  emits('close')
}
</script>
