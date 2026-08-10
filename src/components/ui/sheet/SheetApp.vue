<!-- 侧边封装 -->
<template>
  <UiSheet v-model:open="open" @update:open="openChange">
    <UiSheetTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </UiSheetTrigger>
    <UiSheetContent
      class="gap-0"
      :style="{ width: contentWidth }"
      :closable="closable"
      @escape-key-down="
        (event: Event) => {
          if (!closeOnEscape) event.preventDefault()
        }
      "
      @interact-outside="
        (event: Event) => {
          if (!closeOnInteractOutside) event.preventDefault()
        }
      "
    >
      <UiSheetHeader v-if="title || $slots.title || description || $slots.description">
        <UiSheetTitle v-if="$slots.title"><slot name="title" /></UiSheetTitle>
        <UiSheetTitle v-else>{{ title }}</UiSheetTitle>
        <UiSheetDescription v-if="$slots.description">
          <slot name="description" />
        </UiSheetDescription>
        <UiDialogDescription v-else-if="description">{{ description }}</UiDialogDescription>
        <UiDialogDescription v-else class="sr-only">none</UiDialogDescription>
      </UiSheetHeader>
      <div class="flex-1 min-h-0">
        <UiScrollArea class="h-full" :view-class="cn('px-8 py-6', bodyClass)">
          <slot />
        </UiScrollArea>
      </div>
      <UiSheetFooter v-if="$slots.footer">
        <slot name="footer" />
      </UiSheetFooter>
    </UiSheetContent>
  </UiSheet>
</template>

<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const open = defineModel<boolean>('open', { default: false })
const {
  title,
  description,
  size,
  closable = true,
  closeOnInteractOutside = false,
  closeOnEscape = true,
} = defineProps<{
  /** 宽度 */
  size?: number | string
  /** 标题 */
  title?: string
  /** 描述 */
  description?: string
  /** 是否显示关闭按钮，默认显示 */
  closable?: boolean
  /** 是否允许点击外部区域关闭，默认不允许 */
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
  if (!size) return '384px'

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

<style lang="less" scoped></style>
