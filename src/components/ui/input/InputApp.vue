<script setup lang="ts">
import { Eye, EyeOff } from '@lucide/vue'
import { cloneDeep, omit } from 'es-toolkit'
import type { HTMLAttributes, InputHTMLAttributes } from 'vue'
import { computed, ref } from 'vue'

import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const modelValue = defineModel<string | number>()
const {
  type = 'text',
  disabled = false,
  autofocus = false,
  ...props
} = defineProps<{
  class?: HTMLAttributes['class']
  defaultValue?: string | number
  type?: InputHTMLAttributes['type']
  disabled?: boolean
  /** 最大长度 */
  maxlength?: number
  /** 是否自动获得焦点 */
  autofocus?: boolean
}>()
const emits = defineEmits<{
  /** 值改变时触发 */
  change: [v?: number | string]
  /** 获得焦点时触发 */
  focus: [e: FocusEvent]
  /** 失去焦点时触发 */
  blur: [e: FocusEvent]
}>()

onBeforeMount(() => {
  if (modelValue.value === undefined || modelValue.value === null) {
    modelValue.value = props.defaultValue
  }
})

onMounted(() => {
  if (autofocus) {
    inputRef.value?.$el.nextElementSibling.focus()
  }
})

/**
 * ====================
 *       最大长度逻辑
 * ====================
 */
const onComposition = shallowRef(false)
const inputRef = useTemplateRef('inputRef')
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

/**
 * ====================
 *      密码显隐逻辑
 * ====================
 */
const showPassword = ref(false)

const isPassword = computed(() => type === 'password')

// password 类型内部可切换为 text，其它类型保持原样透传。
const inputType = computed(() => {
  if (!isPassword.value) {
    return type
  }

  return showPassword.value ? 'text' : 'password'
})

function togglePasswordVisible() {
  if (disabled) {
    return
  }

  showPassword.value = !showPassword.value
}
</script>

<template>
  <UiInputGroup :class="props.class" :data-disabled="disabled ? 'true' : undefined">
    <UiInputGroupInput
      v-bind="omit($attrs, ['onUpdate:modelValue', 'onInput', 'onChange', 'name'])"
      v-model="modelValue"
      ref="inputRef"
      :default-value="props.defaultValue"
      :type="inputType"
      :disabled="disabled"
      :class="cn(isPassword && 'pr-1')"
      @input="input"
      @compositionstart="onComposition = true"
      @compositionend="compositionend"
      @change="emits('change', cloneDeep(modelValue))"
      @focus="emits('focus', $event)"
      @blur="emits('blur', $event)"
    />

    <!-- 最大长度提示 -->
    <UiInputGroupAddon v-if="maxlength" align="inline-end">
      {{ modelValue?.toString().length ?? 0 }}/{{ props.maxlength }}
    </UiInputGroupAddon>

    <!-- 密码显隐按钮 -->
    <UiInputGroupAddon v-if="isPassword" align="inline-end">
      <!-- 避免点击显隐按钮时 input 失焦。 -->
      <UiInputGroupButton
        type="button"
        size="icon-xs"
        :disabled="disabled"
        :aria-label="showPassword ? '隐藏密码' : '显示密码'"
        :aria-pressed="showPassword"
        @mousedown.prevent
        @click="togglePasswordVisible"
      >
        <EyeOff v-if="showPassword" />
        <Eye v-else />
      </UiInputGroupButton>
    </UiInputGroupAddon>

    <slot />
  </UiInputGroup>
</template>
