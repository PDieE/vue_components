<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { cloneDeep, omit } from 'es-toolkit'
import type { HTMLAttributes } from 'vue'

defineOptions({
  // 手动把透传属性交给内部 input，避免落到外层 InputGroup 上。
  inheritAttrs: false,
})

const modelValue = defineModel<number | string>()

const {
  disabled = false,
  readonly = false,
  min = 0,
  max = Infinity,
  unit,
  decimalPlaces,
  step = 1,
  controls = true,
  ...props
} = defineProps<{
  class?: HTMLAttributes['class']
  /** 标题 */
  label?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 单位 */
  unit?: string
  /** 小数位数 */
  decimalPlaces?: number
  /** 步长 */
  step?: number
  /** 是否显示增减按钮 */
  controls?: boolean
}>()
const emits = defineEmits<{
  /** 值改变时触发 */
  change: [v?: number | string]
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const current = ref<string>()
const isInactive = computed(() => disabled || readonly)
const currentNum = computed(() => {
  if (typeof current.value === 'number') return current.value
  if (current.value === undefined) return 0
  const num = parseFloat(current.value)
  if (Number.isNaN(num)) return 0
  return num
})
/** 更新外部 v-model 和原生输入框显示值。 */
function setValue(v: number | string, el?: HTMLInputElement) {
  if (el) {
    el.value = v.toString()
  }
  modelValue.value = cloneDeep(parseNumber(v))
}
/** 增加 */
function increase() {
  if (isInactive.value) return
  const precision = Math.max(getPrecision(currentNum.value), getPrecision(step))
  const factor = 10 ** precision
  let v = Math.min((currentNum.value * factor + step * factor) / factor, max).toString()
  v = removeOverDecimalPlaces(v)
  v = parseFloat(v).toFixed(innerDecimalPlaces.value)

  current.value = v
  setValue(v)
}
/** 减少 */
function decrease() {
  if (isInactive.value) return
  const precision = Math.max(getPrecision(currentNum.value), getPrecision(step))
  const factor = 10 ** precision
  let v = Math.max((currentNum.value * factor - step * factor) / factor, min).toString()
  v = removeOverDecimalPlaces(v)

  v = parseFloat(v).toFixed(innerDecimalPlaces.value)

  current.value = v
  setValue(v)
}
/** 得到焦点 */
function focus() {
  if (
    !['number', 'string'].includes(typeof modelValue.value) ||
    modelValue.value === undefined ||
    modelValue.value === ''
  ) {
    current.value = ''
    return
  }

  current.value = (parseNumber(modelValue.value) ?? '').toString()
}
const onComposition = shallowRef(false)
/** 输入时将内容归一化为数字格式。 */
function input(e: InputEvent) {
  if (isInactive.value) return
  if (!e.target) return
  const el = e.target as HTMLInputElement
  const value = el.value

  // 组合输入时，不处理
  if (onComposition.value) return

  let v = value.replace(/[。 ，,]/g, '.')

  // 如果不是科学计数法/正负数的话需要去除非数字字符
  if (!/^-?(?:\d+\.?\d*|\.\d+)?(?:[eE][+-]?\d*)?$/.test(v)) {
    v = v.replace(/[^\d.]/g, '')
    const firstDot = v.indexOf('.')
    if (firstDot !== -1) {
      v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, '')
    }
  }

  // 去除超出的位数，如果需要的话
  v = removeOverDecimalPlaces(v)

  current.value = v
  setValue(v, el)
}
/** 组合输入结束 */
function compositionend(e: CompositionEvent) {
  onComposition.value = false
  input(e as unknown as InputEvent)
}

/**
 * ====================
 *       工具方法
 * ====================
 */
const innerDecimalPlaces = computed(() => {
  if (typeof decimalPlaces !== 'number' || decimalPlaces < 0) return undefined
  return Math.floor(decimalPlaces)
})
/** 补充足量小数位数 */
function fixDecimalPlaces(num: number | string) {
  if (innerDecimalPlaces.value === undefined) return num
  return parseFloat(String(num)).toFixed(innerDecimalPlaces.value)
}
/** 去除多余的位数 */
function removeOverDecimalPlaces(v: string) {
  const firstDot = v.indexOf('.')
  if (innerDecimalPlaces.value !== undefined && firstDot > -1) {
    return v.slice(0, v.indexOf('.') + innerDecimalPlaces.value + 1)
  }
  return v
}
/** 获取小数位数 */
function getPrecision(num: number | string) {
  const str = String(num)

  if (!str.includes('.')) return 0

  return str.split('.')[1]!.length
}
/** 解析为数字 */
function parseNumber(num: number | string) {
  if (num === undefined || num === '') return undefined
  return parseFloat(String(num))
}
/** 同步外部传入值到输入框显示值 */
function syncCurrentFromModelValue() {
  if (
    !['number', 'string'].includes(typeof modelValue.value) ||
    modelValue.value === undefined ||
    modelValue.value === ''
  ) {
    current.value = ''
    return
  }

  const normalizedValue = removeOverDecimalPlaces(String(modelValue.value))
  current.value = fixDecimalPlaces(normalizedValue).toString()

  if (normalizedValue !== String(modelValue.value)) {
    setValue(normalizedValue)
  }
}
watch(
  [modelValue, () => decimalPlaces],
  () => {
    if (Number(modelValue.value) === Number(current.value)) return
    syncCurrentFromModelValue()
  },
  { immediate: true },
)
</script>

<template>
  <UiInputGroup :class="props.class" :data-disabled="disabled ? 'true' : undefined">
    <UiInputGroupInput
      v-bind="omit($attrs, ['onUpdate:modelValue', 'onInput', 'onChange'])"
      :model-value="current"
      :disabled="disabled"
      :readonly="readonly"
      @input="input"
      @compositionstart="onComposition = true"
      @compositionend="compositionend"
      @focus="focus"
      @blur="syncCurrentFromModelValue"
      @change="emits('change', cloneDeep(modelValue))"
    />
    <UiInputGroupAddon
      v-if="!isInactive && controls"
      class="flex flex-col gap-0 opacity-0 group-hover/input-group:opacity-100"
      align="inline-end"
    >
      <Icon
        class="size-3 text-foreground-2 cursor-pointer transition-all hover:text-foreground active:bg-hover rounded"
        icon="icon-park-outline:up"
        @click.stop="increase()"
      />
      <Icon
        class="size-3 text-foreground-2 cursor-pointer transition-all hover:text-foreground active:bg-hover rounded"
        icon="icon-park-outline:down"
        @click.stop="decrease()"
      />
    </UiInputGroupAddon>
    <UiInputGroupAddon v-if="unit" align="inline-end" @click.stop>{{ unit }}</UiInputGroupAddon>
    <slot />
  </UiInputGroup>
</template>
