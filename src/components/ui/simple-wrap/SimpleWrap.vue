<template>
  <div>
    <slot v-if="showContent"></slot>
    <UiCard v-else-if="type === 'card'">
      <div v-if="loading" class="text-center py-16" :class="loadingClass">
        <UiSpinner class="inline-block size-8" />
      </div>
      <SimpleWrapError v-else-if="error" v-bind="errorOpts" @retry="emits('retry')">
        <template v-if="$slots.errorMedia" #media><slot name="errorMedia" /></template>
        <template v-if="$slots.errorTitle" #title><slot name="errorTitle" /></template>
        <template v-if="$slots.errorDescription" #description>
          <slot name="errorDescription" />
        </template>
        <template v-if="$slots.errorContent" #content><slot name="errorContent" /></template>
        <template v-if="$slots.errorAfter" #default><slot name="errorAfter" /></template>
      </SimpleWrapError>
      <SimpleWrapEmpty v-else-if="empty" v-bind="emptyOpts">
        <template v-if="$slots.emptyMedia" #media><slot name="emptyMedia" /></template>
        <template v-if="$slots.emptyTitle" #title><slot name="emptyTitle" /></template>
        <template v-if="$slots.emptyDescription" #description>
          <slot name="emptyDescription" />
        </template>
        <template v-if="$slots.emptyContent" #content><slot name="emptyContent" /></template>
        <template v-if="$slots.emptyAfter" #default><slot name="emptyAfter" /></template>
      </SimpleWrapEmpty>
    </UiCard>
    <template v-else>
      <div v-if="loading" class="text-center py-16" :class="loadingClass">
        <UiSpinner class="inline-block size-8" />
      </div>
      <SimpleWrapError v-else-if="error" v-bind="errorOpts" @retry="emits('retry')">
        <template v-if="$slots.errorMedia" #media><slot name="errorMedia" /></template>
        <template v-if="$slots.errorTitle" #title><slot name="errorTitle" /></template>
        <template v-if="$slots.errorDescription" #description>
          <slot name="errorDescription" />
        </template>
        <template v-if="$slots.errorContent" #content><slot name="errorContent" /></template>
        <template v-if="$slots.errorAfter" #default><slot name="errorAfter" /></template>
      </SimpleWrapError>
      <SimpleWrapEmpty v-else-if="empty" v-bind="emptyOpts">
        <template v-if="$slots.emptyMedia" #media><slot name="emptyMedia" /></template>
        <template v-if="$slots.emptyTitle" #title><slot name="emptyTitle" /></template>
        <template v-if="$slots.emptyDescription" #description>
          <slot name="emptyDescription" />
        </template>
        <template v-if="$slots.emptyContent" #content><slot name="emptyContent" /></template>
        <template v-if="$slots.emptyAfter" #default><slot name="emptyAfter" /></template>
      </SimpleWrapEmpty>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import type { EmptyAppProps } from '../empty/index.ts'
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
  error?: boolean | EmptyAppProps
  /** 空状态, 优先级最低 */
  empty?: boolean | EmptyAppProps
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
  const opts: EmptyAppProps = {}
  if (error === true || !error) return opts
  return { ...opts, ...error }
})
const emptyOpts = computed(() => {
  const opts: EmptyAppProps = {}
  if (empty === true || !empty) return opts
  return { ...opts, ...empty }
})
</script>

<style lang="less" scoped></style>
