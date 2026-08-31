<script setup lang="ts">
import { cloneDeep, omit } from 'es-toolkit'
import type { HTMLAttributes } from 'vue'

import Textarea from './Textarea.vue'

defineOptions({
  // 手动把透传属性交给内部 input，避免落到外层 InputGroup 上。
  inheritAttrs: false,
})

const modelValue = defineModel<string | number>()
const props = defineProps<{
  class?: HTMLAttributes['class']
  defaultValue?: string | number
  /** 最大长度 */
  maxlength?: number
}>()
const emits = defineEmits<{
  /** 值改变时触发 */
  change: [v?: number | string]
}>()

onBeforeMount(() => {
  if (modelValue.value === undefined || modelValue.value === null) {
    modelValue.value = props.defaultValue
  }
})

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const onComposition = shallowRef(false)
/** 输入事件，处理输入的内容为正常的数字格式 */
function input(e: InputEvent) {
  if (!e.target) return
  const el = e.target as HTMLInputElement
  const value = el.value

  // 组合输入时，不处理
  if (onComposition.value) return

  if (!props.maxlength) {
    modelValue.value = value
    return
  }

  modelValue.value = value.slice(0, props.maxlength)
  el.value = modelValue.value
}
/** 组合输入结束 */
function compositionend(e: CompositionEvent) {
  onComposition.value = false
  input(e as unknown as InputEvent)
}
</script>

<template>
  <div>
    <Textarea
      v-bind="omit($attrs, ['onUpdate:modelValue', 'onInput', 'onChange'])"
      :model-value="modelValue"
      :class="props.class"
      @input="input"
      @compositionstart="onComposition = true"
      @compositionend="compositionend"
      @change="emits('change', cloneDeep(modelValue))"
    />

    <!-- 最大长度提示 -->
    <div v-if="props.maxlength" class="text-right text-foreground-2 text-sm mt-1">
      {{ modelValue?.toString().length ?? 0 }}/{{ props.maxlength }}
    </div>
  </div>
</template>
