<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import type { TagsInputRootEmits, TagsInputRootProps } from 'reka-ui'
import { useForwardPropsEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const modelValue = defineModel<string[]>()
const {
  placeholder,
  maxlength,
  readonly = false,
  ...props
} = defineProps<
  Omit<TagsInputRootProps, 'modelValue'> & {
    class?: HTMLAttributes['class']
    /** 输入框占位符 */
    placeholder?: string
    /** 最大输入长度 */
    maxlength?: number
    /** 是否只读，只读时不可输入和操作 */
    readonly?: boolean
  }
>()
const emits = defineEmits<Omit<TagsInputRootEmits, 'update:modelValue'>>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)

/**
 * ====================
 *       长度显示
 * ====================
 */
const str = shallowRef('')
const isComposing = shallowRef(false)
function onCompositionStart() {
  isComposing.value = true
}
function onCompositionEnd(e: CompositionEvent) {
  isComposing.value = false

  const target = e.target as HTMLInputElement
  str.value = target.value
}
function onInput(e: InputEvent) {
  if (isComposing.value) return
  const target = e.target as HTMLInputElement
  str.value = target.value
}
</script>

<template>
  <UiTagsInput v-model="modelValue" v-bind="forwarded" :class="cn('', props.class)">
    <UiTagsInputItem v-for="item in modelValue" :key="item" :value="item">
      <UiTagsInputItemText />
      <UiTagsInputItemDelete v-if="!readonly && !props.disabled" />
    </UiTagsInputItem>
    <UiTagsInputInput
      :class="[readonly && 'pointer-events-none']"
      :placeholder="placeholder"
      :max-length="maxlength"
      :disabled="readonly || props.disabled"
      @input="onInput"
      @compositionstart="onCompositionStart"
      @compositionend="onCompositionEnd"
    />
    <span v-if="maxlength" class="text-muted-foreground">
      {{ str?.length ?? 0 }}/{{ maxlength }}
    </span>
  </UiTagsInput>
</template>
