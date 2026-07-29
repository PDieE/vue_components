<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { HTMLAttributes } from 'vue'

import type { InputCompareValue } from '.'

defineOptions({
  // 手动把透传属性交给内部 input，避免落到外层 InputGroup 上。
  inheritAttrs: false,
})

const modelValue = defineModel<InputCompareValue>({ default: () => ({ compare: '>', value: '' }) })
const props = withDefaults(
  defineProps<{
    defaultValue?: InputCompareValue
    /** 标题 */
    label?: string
    /** 是否禁用 */
    disabled?: boolean
    /** 最小值 */
    min?: number
    /** 最大值 */
    max?: number
    class?: HTMLAttributes['class']
  }>(),
  { disabled: false, min: 0, max: Infinity },
)
if (!modelValue.value || (!modelValue.value.value && modelValue.value.compare === '>')) {
  modelValue.value = props.defaultValue || { compare: '>', value: '' }
}

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const groupRef = useTemplateRef('groupRef')
/** 伪装原生change事件 */
function dispatchChange() {
  groupRef.value?.$el.querySelector('input').dispatchEvent(
    new Event('change', {
      bubbles: true,
    }),
  )
}
const compareOptions = [
  { value: '=', label: '=' },
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '≥' },
  { value: '<=', label: '≤' },
]
const current = computed(() => Number(modelValue.value.value) || 0)
/** 增加 */
function increase() {
  if (props.disabled) return
  modelValue.value.value = Math.min(current.value + 1, props.max)
  dispatchChange()
}
/** 减少 */
function decrease() {
  if (props.disabled) return
  modelValue.value.value = Math.max(current.value - 1, props.min)
  dispatchChange()
}
</script>

<template>
  <UiInputGroup
    ref="groupRef"
    :class="props.class"
    :data-disabled="props.disabled ? 'true' : undefined"
  >
    <UiInputGroupAddon v-if="props.label" class="text-foreground mr-2">
      {{ props.label }}
    </UiInputGroupAddon>
    <UiDropdownMenu>
      <UiDropdownMenuTrigger>
        <UiInputGroupAddon class="bg-[#F0F2F7] rounded-md px-3 h-5.5 text-foreground">
          {{ compareOptions.find((v) => v.value === modelValue.compare)?.label || '' }}
        </UiInputGroupAddon>
      </UiDropdownMenuTrigger>
      <UiDropdownMenuContent class="w-8.5 min-w-0">
        <UiDropdownMenuGroup>
          <UiDropdownMenuItem
            v-for="item in compareOptions"
            :key="item.value"
            :value="item.value"
            @click="() => { modelValue.compare = item.value; dispatchChange() }"
          >
            {{ item.label }}
          </UiDropdownMenuItem>
        </UiDropdownMenuGroup>
      </UiDropdownMenuContent>
    </UiDropdownMenu>
    <UiInputGroupInput
      v-bind="$attrs"
      v-model="modelValue.value"
      :default-value="props.defaultValue"
      :disabled="props.disabled"
    />
    <UiInputGroupAddon
      v-if="!props.disabled"
      class="flex flex-col gap-0 opacity-0 group-hover/input-group:opacity-100"
      align="inline-end"
    >
      <Icon
        class="size-3 text-foreground-2 cursor-pointer transition-all hover:text-foreground active:bg-hover rounded"
        icon="icon-park-outline:up"
        @click="increase()"
      />
      <Icon
        class="size-3 text-foreground-2 cursor-pointer transition-all hover:text-foreground active:bg-hover rounded"
        icon="icon-park-outline:down"
        @click="decrease()"
      />
    </UiInputGroupAddon>
  </UiInputGroup>
</template>
