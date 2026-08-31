<script setup lang="ts">
import { Icon } from '@iconify/vue'
import dayjs from 'dayjs'

import type { ComboboxOption } from '@/components/ui/combobox'
import type { InputCompareValue } from '@/components/ui/input'

const {
  label,
  type = 'default',
  data,
  options,
} = defineProps<{
  /** 标题 */
  label: string
  /**
   * 类型
   * @describe default: 默认; map: 映射类型，配合各种选择器，需要传入options; compare: 比较类型，配合 InputCompare 组件使用;
   * @describe dateRange: 日期范围，配合 DatePickerRange 组件使用
   */
  type?: 'default' | 'map' | 'compare' | 'dateRange'
  /** 数据 */
  data?: string | number | InputCompareValue | [string, string]
  /** Map选项 */
  options?: ComboboxOption[]
}>()
const emits = defineEmits<{
  /** 清空 */
  clear: []
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const str = computed(() => {
  if (!data) return ''

  const gate: Record<typeof type, () => string> = {
    /** 默认 */
    default: () => String(data),
    /** 映射类型 */
    map: () => {
      if (!options?.length) return ''
      return options.find((option) => option.value === data)?.label || ''
    },
    /** 比较类型 */
    compare: () => {
      if (Array.isArray(data)) return ''
      // compare,数据结构符合才会返回字符串
      if (typeof data === 'object' && data.compare && data.value)
        return `${data.compare}${data.value}`

      return ''
    },
    /** 日期范围 */
    dateRange: () => {
      if (!Array.isArray(data) || !data[0] || !data[1]) return ''
      const start = dayjs(data[0])
      const end = dayjs(data[1])
      if (start.isSame(end, 'month')) return `${start.format('YYYY-MM-DD')}~${end.format('DD')}`
      if (start.isSame(end, 'year')) return `${start.format('YYYY-MM-DD')}~${end.format('MM-DD')}`
      return `${start.format('YYYY-MM-DD')}~${end.format('YYYY-MM-DD')}`
    },
  }

  return gate[type]?.() || ''
})
</script>

<template>
  <UiTag v-if="str" class="rounded bg-brand-bg-hover text-[#0C296E]" :border="false">
    {{ label }}：{{ str }}
    <UiButton class="size-4 rounded" variant="ghost" size="icon" @click="emits('clear')">
      <template #icon>
        <Icon class="size-3 text-foreground-3" icon="icon-park-outline:close" />
      </template>
    </UiButton>
  </UiTag>
</template>
