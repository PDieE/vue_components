<template>
  <Popover>
    <PopoverTrigger as-child>
      <RichEditorButton :tip="tip">
        <template #icon>
          <Icon :style="{ color: color }" :icon="icon" inline />
        </template>
      </RichEditorButton>
    </PopoverTrigger>

    <PopoverContent
      side="bottom"
      align="start"
      :side-offset="10"
      class="overflow-hidden p-2 w-auto"
      will-change="transform,opacity"
    >
      <SketchPicker v-model="innerColor" class="p-0! shadow-none!" />
      <UiButton theme="brand" size="xs" block @click="confirm()">确认</UiButton>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import 'vue-color/style.css'
import { Icon } from '@iconify/vue'
import { cloneDeep } from 'es-toolkit'
import { shallowRef, watch } from 'vue'
import { SketchPicker } from 'vue-color'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import RichEditorButton from './RichEditorButton.vue'

const {
  icon,
  color = undefined,
  tip = undefined,
} = defineProps<{
  /** 图标 */
  icon: string
  /** 颜色 */
  color?: string
  /** 提示 */
  tip?: string
}>()
watch(
  () => color,
  (val) => {
    innerColor.value = val || '#000000'
  },
)
const emits = defineEmits<{
  /**
   * 确认颜色
   * @param color 颜色
   */
  confirm: [color?: string]
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
/** 选择框popup是否显示 */
const innerColor = shallowRef<string>('#000000')
/** 确认颜色 */
function confirm() {
  emits('confirm', cloneDeep(innerColor.value))
}
</script>

<style scoped></style>
