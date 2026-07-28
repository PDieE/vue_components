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

const modelValue = defineModel<string>()
const props = withDefaults(
  defineProps<{
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
    class?: HtmlHTMLAttributes['class']
  }>(),
  {
    placeholder: '请选择日期',
    clearable: true,
    disabled: false,
    enableTimePicker: false,
  },
)
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
  () => props.valueFormat ?? (props.enableTimePicker ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'),
)
const timeColumns = computed<WheelPickerGroupColumn[]>(() => [
  {
    options: Array.from({ length: 24 }, (_, i) => {
      const value = String(i).padStart(2, '0')
      return { label: value, value }
    }),
  },
  {
    options: Array.from({ length: 60 }, (_, i) => {
      const value = String(i).padStart(2, '0')
      return { label: value, value }
    }),
  },
  {
    options: Array.from({ length: 60 }, (_, i) => {
      const value = String(i).padStart(2, '0')
      return { label: value, value }
    }),
  },
])

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
  if (!props.enableTimePicker) return

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
  open.value = props.enableTimePicker
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
    props.enableTimePicker ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD',
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
        :disabled="props.disabled"
      >
        <span :class="['flex-1 truncate', dateShow && 'text-foreground']">
          {{ dateShow ? dateShow : props.placeholder }}
        </span>
        <CalendarIcon
          class="text-foreground-2 group-disabled:text-foreground-3"
          :class="props.clearable && dateShow && 'transition-all group-hover:opacity-0'"
        />
        <span
          v-if="props.clearable && dateShow"
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
          locale="zh-CN"
          @update:model-value="valueChanged"
        />
        <div v-if="props.enableTimePicker" class="flex flex-col border-l px-3 py-4">
          <UiWheelPickerGroup
            v-model="timeValue"
            :columns="timeColumns"
            :visible-option-count="3"
            @change="timeChanged"
          />
        </div>
      </div>
      <div v-if="props.enableTimePicker" class="text-right p-2 border-t">
        <UiButton size="xs" theme="brand" @click="confirm()">确定</UiButton>
      </div>
    </UiPopoverContent>
  </UiPopover>
</template>
