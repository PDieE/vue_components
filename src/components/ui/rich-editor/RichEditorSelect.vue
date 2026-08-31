<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <RichEditorButton :tip="tip" shape="rectangle">
        <template #icon>
          <Icon :icon="active?.icon ?? ''" inline />
          <Icon class="text-gray-400 ml-0.5" icon="tdesign:chevron-down" inline />
        </template>
      </RichEditorButton>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      side="bottom"
      align="start"
      :side-offset="10"
      class="space-y-0.5 bg-white p-0 data-[state=open]:animate-slide-upfade"
      will-change="transform,opacity"
    >
      <DropdownMenuItem
        v-for="item in options"
        :key="item.value"
        class="h-8 rounded-3px px-2 py-0 transition-all"
        :class="{
          'bg-brand-bg text-brand': item.active,
          'hover:bg-gray-100 text-gray-700': !item.active,
        }"
        @click="select(item)"
      >
        <Icon :icon="item.icon" class="size-4" inline />
        <span>{{ item.label }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import RichEditorButton from './RichEditorButton.vue'
import type { RichEditorSelectOption } from './types'

const { tip = undefined, options } = defineProps<{
  /** 提示 */
  tip?: string
  /** 可选项 */
  options: RichEditorSelectOption[]
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const active = computed(() => {
  return options.find((item) => item.active)
})
/**
 * 选择选项
 * @param option 选项
 */
function select(option: RichEditorSelectOption) {
  option.action()
}
</script>

<style scoped></style>
