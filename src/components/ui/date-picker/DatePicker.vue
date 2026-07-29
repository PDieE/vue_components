<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { CalendarIcon } from '@lucide/vue'
import dayjs from 'dayjs'
import { cloneDeep } from 'es-toolkit'
import type { HtmlHTMLAttributes } from 'vue'

import type { WheelPickerGroupColumn, WheelPickerValue } from '@/components/ui/wheel-picker'
import { cn } from '@/lib/utils'

import type { DisableDate } from '.'

const modelValue = defineModel<string>()
const {
  valueFormat,
  placeholder = '请选择日期',
  clearable = true,
  disabled = false,
  enableTimePicker = false,
  disableDate,
  disableTime,
  ...props
} = defineProps<{
  class?: HtmlHTMLAttributes['class']
  /** 值格式 */
  valueFormat?: string | 'timestamp' | 'msTimestamp'
  /** 占位符 */
  placeholder?: string
  /** 是否可清空 */
  clearable?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否启用时间选择 */
  enableTimePicker?: boolean
  /** 禁用日期 */
  disableDate?: DisableDate
  /** 禁用时间 */
  disableTime?: (time: dayjs.Dayjs) => Partial<{
    hour: Array<number>
    minute: Array<number>
    second: Array<number>
  }>
}>()
type DatePickerProps = {
  /** 值格式 */
  valueFormat?: string | 'timestamp' | 'msTimestamp'
}
const emits = defineEmits<{
  /**
   * 日期选择器值改变时触发
   * @param v 日期
   */
  change: [v?: string]
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const innerValue = ref<DateValue>()
const timeValue = ref<WheelPickerValue[]>(['00', '00', '00'])
const effectiveValueFormat = computed<DatePickerProps['valueFormat']>(
  () => valueFormat ?? (enableTimePicker ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'),
)
/** 禁用的时间 */
const disabledTime = computed(() => {
  if (!enableTimePicker || !disableTime) return {}

  const selectedDate = innerValue.value ?? today(getLocalTimeZone())
  return disableTime(getSelectedDate(selectedDate))
})
const timeColumns = computed<WheelPickerGroupColumn[]>(() => [
  {
    options: Array.from({ length: 24 }, (_, i) => {
      const value = String(i).padStart(2, '0')
      return { label: value, value, disabled: disabledTime.value.hour?.includes(i) }
    }),
  },
  {
    options: Array.from({ length: 60 }, (_, i) => {
      const value = String(i).padStart(2, '0')
      return { label: value, value, disabled: disabledTime.value.minute?.includes(i) }
    }),
  },
  {
    options: Array.from({ length: 60 }, (_, i) => {
      const value = String(i).padStart(2, '0')
      return { label: value, value, disabled: disabledTime.value.second?.includes(i) }
    }),
  },
])

/**
 * 将任意日期值归一化为本地日期，忽略其时间部分。
 * @param value 日期值
 */
function toDay(value: string | number | Date | dayjs.Dayjs | undefined) {
  if (!value) return undefined
  const date = dayjs(value)
  return date.isValid() ? date.startOf('day') : undefined
}
/**
 * 判断日期是否禁用（用于 Reka UI Calendar 使用）
 * @param date 日期值
 */
function isDateDisabled(date: DateValue) {
  if (!disableDate) return false

  const currentDay = dayjs(date.toDate(getLocalTimeZone())).startOf('day')

  // function类型的直接调用
  if (typeof disableDate === 'function') return disableDate(currentDay)

  // array类型的直接判断
  if (Array.isArray(disableDate)) {
    return disableDate.some((value) => currentDay.isSame(toDay(value), 'day'))
  }

  const from = toDay(disableDate.from)
  const to = toDay(disableDate.to)
  const before = toDay(disableDate.before)
  const after = toDay(disableDate.after)

  // `from` 和 `to` 必须成对存在；单独传入时不产生禁用范围。
  if (
    from &&
    to &&
    currentDay.isAfter(from.subtract(1, 'd'), 'day') &&
    currentDay.isBefore(to.add(1, 'd'), 'day')
  ) {
    return true
  }

  // `before` 和 `after` 可以单独判断
  if (before && currentDay.isBefore(before, 'day')) {
    return true
  }

  if (after && currentDay.isAfter(after, 'day')) {
    return true
  }

  return false
}

function normalizeTimePart(value?: WheelPickerValue) {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? String(numberValue).padStart(2, '0') : '00'
}

function getSelectedDate(v: DateValue) {
  const [hour, minute, second] = timeValue.value.map(normalizeTimePart)
  return dayjs(v.toDate(getLocalTimeZone()))
    .hour(Number(hour))
    .minute(Number(minute))
    .second(Number(second))
    .millisecond(0)
}

function formatModelValue(v: DateValue) {
  const date = getSelectedDate(v)
  if (effectiveValueFormat.value === 'timestamp') return String(date.unix())
  if (effectiveValueFormat.value === 'msTimestamp') return String(date.valueOf())
  return date.format(effectiveValueFormat.value)
}
function parseModelValue(v: string) {
  if (['timestamp', 'msTimestamp'].includes(effectiveValueFormat.value ?? '')) {
    const timestamp = Number(v)
    if (!Number.isFinite(timestamp)) return

    const date = dayjs(effectiveValueFormat.value === 'timestamp' ? timestamp * 1000 : timestamp)
    return date.isValid() ? parseDate(date.format('YYYY-MM-DD')) : undefined
  }

  const date = dayjs(v)
  return date.isValid() ? parseDate(date.format('YYYY-MM-DD')) : undefined
}
function syncTimeValue(v: string) {
  if (!enableTimePicker) return

  const date = ['timestamp', 'msTimestamp'].includes(effectiveValueFormat.value ?? '')
    ? dayjs(effectiveValueFormat.value === 'timestamp' ? Number(v) * 1000 : Number(v))
    : dayjs(v)

  if (!date.isValid()) return
  timeValue.value = [date.format('HH'), date.format('mm'), date.format('ss')]
}
watch(
  [modelValue, effectiveValueFormat],
  ([v]) => {
    if (v === undefined || v === '') {
      innerValue.value = undefined
      timeValue.value = ['00', '00', '00']
      return
    }

    const nextValue = parseModelValue(v)
    if (!nextValue) {
      innerValue.value = undefined
      return
    }

    syncTimeValue(v)

    if (!innerValue.value) {
      innerValue.value = nextValue
      return
    }

    if (
      dayjs(nextValue.toDate(getLocalTimeZone())).isSame(
        dayjs(innerValue.value.toDate(getLocalTimeZone())),
        'day',
      )
    ) {
      return
    }

    innerValue.value = nextValue
  },
  { immediate: true },
)
const defaultPlaceholder = computed(() => innerValue.value ?? today(getLocalTimeZone()))
const open = shallowRef(false)
/**
 * 日期范围选择器值改变时触发
 * @param v 日期范围
 */
function valueChanged(v?: DateValue) {
  if (!v) {
    modelValue.value = undefined
    emits('change', undefined)
    return
  }
  open.value = enableTimePicker
  const value = formatModelValue(v)
  modelValue.value = value
  emits('change', cloneDeep(value))
}
function timeChanged() {
  if (!innerValue.value) innerValue.value = today(getLocalTimeZone())

  const value = formatModelValue(innerValue.value)
  modelValue.value = value
  emits('change', cloneDeep(value))
}
function confirm() {
  open.value = false
}
function clear() {
  modelValue.value = undefined
  innerValue.value = undefined
  timeValue.value = ['00', '00', '00']
  emits('change', undefined)
}
const dateShow = computed(() => {
  if (modelValue.value === undefined || modelValue.value === '' || !innerValue.value) return
  return getSelectedDate(innerValue.value).format(
    enableTimePicker ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD',
  )
})
</script>

<template>
  <UiPopover v-model:open="open">
    <UiPopoverTrigger as-child>
      <UiButton
        variant="outline"
        :class="
          cn(
            'group relative text-left font-normal text-foreground-3',
            'disabled:bg-disabled disabled:border-input disabled:opacity-100',
            props.class,
          )
        "
        :disabled="disabled"
      >
        <span :class="['flex-1 truncate', dateShow && 'text-foreground']">
          {{ dateShow ? dateShow : placeholder }}
        </span>
        <CalendarIcon
          class="text-foreground-2 group-disabled:text-foreground-3"
          :class="clearable && dateShow && 'transition-all group-hover:opacity-0'"
        />
        <span
          v-if="clearable && dateShow"
          class="z-10 text-foreground-2 absolute right-3 transition-all opacity-0 group-hover:opacity-100 hover:text-foreground-4"
          @click.stop="clear()"
        >
          <Icon icon="icon-park-solid:close-one" />
        </span>
      </UiButton>
    </UiPopoverTrigger>
    <UiPopoverContent class="w-auto p-0" align="start">
      <div class="flex">
        <UiCalendar
          v-model="innerValue"
          :default-placeholder="defaultPlaceholder"
          disable-days-outside-current-view
          :is-date-disabled="isDateDisabled"
          locale="zh-CN"
          @update:model-value="valueChanged"
        />
        <div v-if="enableTimePicker" class="flex flex-col border-l px-3 py-4">
          <UiWheelPickerGroup
            v-model="timeValue"
            :columns="timeColumns"
            :visible-option-count="3"
            @change="timeChanged"
          />
        </div>
      </div>
      <div v-if="enableTimePicker" class="text-right p-2 border-t">
        <UiButton size="xs" theme="brand" :disabled="!innerValue" @click="confirm()">
          确定
        </UiButton>
      </div>
    </UiPopoverContent>
  </UiPopover>
</template>
