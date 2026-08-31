<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { HTMLAttributes } from 'vue'
import { computed, reactive, shallowRef, watch } from 'vue'

import type { WheelPickerGroupColumn, WheelPickerValue } from '@/components/ui/wheel-picker'
import { cn } from '@/lib/utils'

type TimeUnit = 'hour' | 'minute' | 'second'
type TimeToken = 'H' | 'HH' | 'm' | 'mm' | 's' | 'ss'

interface FormatPart {
  token: TimeToken
  unit: TimeUnit
}

const TOKEN_PATTERN = /HH|H|mm|m|ss|s/g
const TOKEN_UNIT_MAP: Record<TimeToken, TimeUnit> = {
  H: 'hour',
  HH: 'hour',
  m: 'minute',
  mm: 'minute',
  s: 'second',
  ss: 'second',
}
const UNIT_RANGE_MAP: Record<TimeUnit, number> = {
  hour: 24,
  minute: 60,
  second: 60,
}

const modelValue = defineModel<string>()

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    /** 展示格式，决定可选择的时间列 */
    format?: string
    /** 值格式，决定 modelValue 的输出格式 */
    valueFormat?: string
    /** 占位符 */
    placeholder?: string
    /** 是否可清空 */
    clearable?: boolean
    /** 是否禁用 */
    disabled?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    format: 'HH:mm:ss',
    placeholder: '请选择时间',
    clearable: true,
    disabled: false,
  },
)

const emits = defineEmits<{
  /** 值改变时触发 */
  change: [v?: string]
}>()

const timeParts = reactive<Record<TimeUnit, string>>({
  hour: '00',
  minute: '00',
  second: '00',
})
const open = shallowRef(false)
const hasValidValue = shallowRef(false)

const effectiveValueFormat = computed(() => props.valueFormat ?? props.format)
const displayParts = computed(() => getFormatParts(props.format))
const columns = computed<WheelPickerGroupColumn[]>(() =>
  displayParts.value.map(({ unit }) => ({
    options: createOptions(UNIT_RANGE_MAP[unit]),
  })),
)
const pickerValue = computed<WheelPickerValue[]>({
  get: () => displayParts.value.map(({ unit }) => timeParts[unit]),
  set: (value) => {
    displayParts.value.forEach(({ unit }, index) => {
      timeParts[unit] = normalizeTimePart(value[index], UNIT_RANGE_MAP[unit] - 1)
    })

    const nextValue = formatTimeValue(effectiveValueFormat.value)
    hasValidValue.value = true
    modelValue.value = nextValue
    emits('change', nextValue)
  },
})
const timeShow = computed(() => {
  if (!hasValidValue.value || !modelValue.value) return ''
  return formatTimeValue(props.format)
})

function createOptions(length: number) {
  return Array.from({ length }, (_, i) => {
    const value = String(i).padStart(2, '0')
    return { label: value, value }
  })
}

function getFormatParts(format: string) {
  const matchedTokens = format.match(TOKEN_PATTERN) ?? []
  const usedUnits = new Set<TimeUnit>()

  return matchedTokens.reduce<FormatPart[]>((parts, token) => {
    const unit = TOKEN_UNIT_MAP[token as TimeToken]
    if (!unit || usedUnits.has(unit)) return parts

    usedUnits.add(unit)
    parts.push({ token: token as TimeToken, unit })
    return parts
  }, [])
}

function normalizeTimePart(value: WheelPickerValue | undefined, max: number) {
  const numberValue = Number(value)
  return Number.isInteger(numberValue) && numberValue >= 0 && numberValue <= max
    ? String(numberValue).padStart(2, '0')
    : '00'
}

function formatTokenValue(token: TimeToken) {
  const value = timeParts[TOKEN_UNIT_MAP[token]]
  return token.length === 1 ? String(Number(value)) : value
}

function formatTimeValue(format: string) {
  return format.replace(TOKEN_PATTERN, (token) => formatTokenValue(token as TimeToken))
}

function parseTimeValue(value: string, format: string) {
  const parts = getFormatParts(format)
  if (!parts.length) return false

  const escapedFormat = format.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const groupedUnits = new Set<TimeUnit>()
  const pattern = escapedFormat.replace(TOKEN_PATTERN, (token) => {
    const unit = TOKEN_UNIT_MAP[token as TimeToken]
    if (!unit) return token
    if (groupedUnits.has(unit)) return '\\d{1,2}'

    groupedUnits.add(unit)
    return `(?<${unit}>\\d{1,2})`
  })
  const match = new RegExp(`^${pattern}$`).exec(value)
  if (!match?.groups) return false

  setTimePart('hour', match.groups.hour, 23)
  setTimePart('minute', match.groups.minute, 59)
  setTimePart('second', match.groups.second, 59)
  return true
}

function setTimePart(unit: TimeUnit, value: string | undefined, max: number) {
  if (value === undefined) return

  const numberValue = Number(value)
  if (!Number.isInteger(numberValue) || numberValue < 0 || numberValue > max) return

  timeParts[unit] = String(numberValue).padStart(2, '0')
}

function resetTimeParts() {
  timeParts.hour = '00'
  timeParts.minute = '00'
  timeParts.second = '00'
}

function clear() {
  resetTimeParts()
  hasValidValue.value = false
  modelValue.value = undefined
  emits('change', undefined)
}

function selectNow() {
  const now = new Date()
  timeParts.hour = String(now.getHours()).padStart(2, '0')
  timeParts.minute = String(now.getMinutes()).padStart(2, '0')
  timeParts.second = String(now.getSeconds()).padStart(2, '0')

  const nextValue = formatTimeValue(effectiveValueFormat.value)
  hasValidValue.value = true
  modelValue.value = nextValue
  emits('change', nextValue)
}

function confirm() {
  open.value = false
}

watch(
  [modelValue, effectiveValueFormat],
  ([value]) => {
    if (!value) {
      resetTimeParts()
      hasValidValue.value = false
      return
    }

    const parsed = parseTimeValue(value, effectiveValueFormat.value)
    hasValidValue.value = parsed
    if (!parsed) resetTimeParts()
  },
  { immediate: true },
)
</script>

<template>
  <UiPopover v-model:open="open">
    <UiPopoverTrigger as-child>
      <UiButton
        v-bind="$attrs"
        variant="outline"
        :class="
          cn(
            'group relative text-left font-normal text-foreground-3',
            'disabled:bg-disabled disabled:border-input disabled:opacity-100',
            'aria-invalid:border-destructive',
            props.class,
          )
        "
        :disabled="props.disabled"
      >
        <span :class="['flex-1 truncate', timeShow && 'text-foreground']">
          {{ timeShow ? timeShow : props.placeholder }}
        </span>
        <Icon
          icon="icon-park-outline:time"
          class="text-foreground-2 group-disabled:text-foreground-3"
          :class="props.clearable && timeShow && 'transition-all group-hover:opacity-0'"
        />
        <span
          v-if="props.clearable && timeShow"
          class="z-10 text-foreground-2 absolute right-3 transition-all opacity-0 group-hover:opacity-100 hover:text-foreground-4"
          @click.stop="clear()"
        >
          <Icon icon="icon-park-solid:close-one" />
        </span>
      </UiButton>
    </UiPopoverTrigger>
    <UiPopoverContent class="w-auto p-0" align="start">
      <div class="px-3 py-4">
        <UiWheelPickerGroup
          v-model="pickerValue"
          :columns="columns"
          :disabled="props.disabled"
          :visible-option-count="3"
        />
      </div>
      <div class="flex justify-end gap-2 p-2 border-t">
        <UiButton size="xs" variant="text" theme="brand" @click="selectNow()">此刻</UiButton>
        <UiButton size="xs" theme="brand" @click="confirm()">确定</UiButton>
      </div>
    </UiPopoverContent>
  </UiPopover>
</template>
