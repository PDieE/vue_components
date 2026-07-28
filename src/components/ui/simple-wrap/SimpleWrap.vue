<template>
  <div>
    <slot v-if="showContent"></slot>
    <UiCard v-else-if="type === 'card'">
      <div v-if="loading" class="text-center py-16" :class="loadingClass">
        <UiSpinner class="inline-block size-8" />
      </div>
      <SimpleWrapError v-else-if="error" v-bind="errorOpts" @retry="emits('retry')">
        <template v-if="$slots.errorContent" #content>
          <slot name="errorContent"></slot>
        </template>
        <template v-if="$slots.errorAfter" #after>
          <slot name="errorAfter"></slot>
        </template>
      </SimpleWrapError>
      <SimpleWrapEmpty v-else-if="empty" v-bind="emptyOpts">
        <template v-if="$slots.emptyContent" #content>
          <slot name="emptyContent"></slot>
        </template>
        <template v-if="$slots.emptyAfter" #after>
          <slot name="emptyAfter"></slot>
        </template>
      </SimpleWrapEmpty>
    </UiCard>
    <template v-else>
      <div v-if="loading" class="text-center py-16" :class="loadingClass">
        <UiSpinner class="inline-block size-8" />
      </div>
      <SimpleWrapError v-else-if="error" v-bind="errorOpts" @retry="emits('retry')">
        <template v-if="$slots.errorContent" #content>
          <slot name="errorContent"></slot>
        </template>
        <template v-if="$slots.errorAfter" #after>
          <slot name="errorAfter"></slot>
        </template>
      </SimpleWrapError>
      <SimpleWrapEmpty v-else-if="empty" v-bind="emptyOpts">
        <template v-if="$slots.emptyContent" #content>
          <slot name="emptyContent"></slot>
        </template>
        <template v-if="$slots.emptyAfter" #after>
          <slot name="emptyAfter"></slot>
        </template>
      </SimpleWrapEmpty>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import type { EmptyProps, ErrorProps } from '.'
import SimpleWrapEmpty from './SimpleWrapEmpty.vue'
import SimpleWrapError from './SimpleWrapError.vue'

const {
  type = 'default',
  loading = false,
  loadingClass,
  error = false,
  empty = false,
} = defineProps<{
  /**
   * 类型
   * @describe default: 常规; card: 卡片;
   */
  type?: 'default' | 'card'
  /** 加载状态, 优先级最高 */
  loading?: boolean
  /** 加载状态的类名 */
  loadingClass?: string
  /** 错误状态, 优先级次于 `loading` */
  error?: boolean | ErrorProps
  /** 空状态, 优先级最低 */
  empty?: boolean | EmptyProps
}>()
const emits = defineEmits<{
  /** 重试 */
  retry: []
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const showContent = computed(() => !loading && !error && !empty)
const errorOpts = computed(() => {
  const opts: ErrorProps = {}
  if (error === true || !error) return opts
  return { ...opts, ...error }
})
const emptyOpts = computed(() => {
  const opts: EmptyProps = {}
  if (empty === true || !empty) return opts
  return { ...opts, ...empty }
})
</script>

<style lang="less" scoped></style>
