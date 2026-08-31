<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { CalendarIcon } from '@lucide/vue'
import dayjs from 'dayjs'
import { cloneDeep } from 'es-toolkit'
import type { DateRange } from 'reka-ui'
import type { HtmlHTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const modelValue = defineModel<[string, string]>()
const {
  valueFormat = 'YYYY-MM-DD',
  placeholder = ['开始日期', '结束日期'],
  clearable = true,
  disabled = false,
  readonly = false,
  ...props
} = defineProps<{
  class?: HtmlHTMLAttributes['class']
  /** 值格式 */
  valueFormat?: string | 'timestamp' | 'msTimestamp'
  /** 占位符 */
  placeholder?: [string, string]
  /** 是否可清空 */
  clearable?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读，只读时不可打开或修改日期 */
  readonly?: boolean
}>()
watch(
  () => readonly,
  (isReadonly) => {
    if (isReadonly) open.value = false
  },
)
const emits = defineEmits<{
  /**
   * 日期选择器值改变时触发
   * @param v 日期
   */
  change: [v?: [string, string]]
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const innerValue = ref<DateRange>()
function formatModelValue(v: DateValue) {
  const date = dayjs(v.toDate(getLocalTimeZone()))
  if (valueFormat === 'timestamp') return String(date.unix())
  if (valueFormat === 'msTimestamp') return String(date.valueOf())
  return date.format(valueFormat)
}
function parseModelValue(v: string) {
  if (['timestamp', 'msTimestamp'].includes(valueFormat)) {
    const timestamp = Number(v)
    if (!Number.isFinite(timestamp)) return

    const date = dayjs(valueFormat === 'timestamp' ? timestamp * 1000 : timestamp)
    return date.isValid() ? parseDate(date.format('YYYY-MM-DD')) : undefined
  }

  const date = dayjs(v)
  return date.isValid() ? parseDate(date.format('YYYY-MM-DD')) : undefined
}
watch(
  modelValue,
  (v) => {
    const start = v?.[0]
    const end = v?.[1]
    if (start === undefined || start === '' || end === undefined || end === '') {
      innerValue.value = {
        start: undefined,
        end: undefined,
      }
      return
    }

    const nextStart = parseModelValue(start)
    const nextEnd = parseModelValue(end)
    if (!nextStart || !nextEnd) {
      innerValue.value = {
        start: undefined,
        end: undefined,
      }
      return
    }

    if (!innerValue.value?.start || !innerValue.value?.end) {
      innerValue.value = { start: nextStart, end: nextEnd }
      return
    }

    if (
      dayjs(nextStart.toDate(getLocalTimeZone())).isSame(
        dayjs(innerValue.value.start.toDate(getLocalTimeZone())),
        'day',
      ) &&
      dayjs(nextEnd.toDate(getLocalTimeZone())).isSame(
        dayjs(innerValue.value.end.toDate(getLocalTimeZone())),
        'day',
      )
    ) {
      return
    }

    innerValue.value = { start: nextStart, end: nextEnd }
  },
  { immediate: true },
)
const defaultPlaceholder = computed(() => innerValue.value?.start ?? today(getLocalTimeZone()))
const open = shallowRef(false)
/**
 * 日期范围选择器值改变时触发
 * @param v 日期范围
 */
function valueChanged(v: DateRange) {
  if (readonly) return

  if (!v.start || !v.end) return
  open.value = false
  const value: [string, string] = [formatModelValue(v.start), formatModelValue(v.end)]
  modelValue.value = value
  emits('change', cloneDeep(value))
}
function clear() {
  if (readonly) return

  modelValue.value = undefined
  innerValue.value = undefined
  emits('change', undefined)
}
const start = computed(() => {
  if (modelValue.value?.[0] === undefined || modelValue.value[0] === '' || !innerValue.value?.start)
    return
  return dayjs(innerValue.value.start.toDate(getLocalTimeZone())).format('YYYY-MM-DD')
})
const end = computed(() => {
  if (modelValue.value?.[1] === undefined || modelValue.value[1] === '' || !innerValue.value?.end)
    return
  return dayjs(innerValue.value.end.toDate(getLocalTimeZone())).format('YYYY-MM-DD')
})
</script>

<template>
  <UiPopover
    :open="open"
    @update:open="(nextOpen) => (!readonly || !nextOpen ? (open = nextOpen) : undefined)"
  >
    <UiPopoverTrigger as-child>
      <UiButton
        variant="outline"
        :class="
          cn(
            'group relative text-left font-normal text-foreground-3',
            readonly && 'cursor-default',
            'disabled:bg-disabled disabled:border-input disabled:opacity-100',
            props.class,
          )
        "
        :disabled="disabled"
      >
        <span :class="['flex-1 truncate', start && 'text-foreground']">
          {{ start ? start : placeholder[0] }}
        </span>
        <span class="text-foreground-3">-</span>
        <span :class="['flex-1 truncate', end && 'text-foreground']">
          {{ end ? end : placeholder[1] }}
        </span>
        <CalendarIcon
          class="text-foreground-2 group-disabled:text-foreground-3"
          :class="!readonly && clearable && start && end && 'transition-all group-hover:opacity-0'"
        />
        <span
          v-if="!readonly && clearable && start && end"
          class="z-10 text-foreground-2 absolute right-3 transition-all opacity-0 group-hover:opacity-100 hover:text-foreground-4"
          @click.stop="clear()"
        >
          <Icon icon="icon-park-solid:close-one" />
        </span>
      </UiButton>
    </UiPopoverTrigger>
    <UiPopoverContent class="w-auto p-0" align="start">
      <UiRangeCalendar
        v-model="innerValue"
        :default-placeholder="defaultPlaceholder"
        :number-of-months="2"
        disable-days-outside-current-view
        locale="zh-CN"
        @update:model-value="valueChanged"
      />
    </UiPopoverContent>
  </UiPopover>
</template>
