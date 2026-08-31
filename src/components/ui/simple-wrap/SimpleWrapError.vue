<template>
  <UiEmptyApp v-bind="props" :description="description">
    <template #media>
      <slot name="media">
        <div class="pl-4.75">
          <ErrorSvg />
        </div>
      </slot>
    </template>
    <template v-if="$slots.title" #title><slot name="title" /></template>
    <template v-if="$slots.description" #description><slot name="description" /></template>
    <template #content>
      <slot name="content">
        <UiButton theme="brand" @click="emits('retry')">
          <template #icon><RefreshCcw /></template>重试
        </UiButton>
      </slot>
    </template>
    <template v-if="$slots.default" #default><slot /></template>
  </UiEmptyApp>
</template>

<script lang="ts" setup>
import { RefreshCcw } from '@lucide/vue'

import type { EmptyAppProps } from '../empty'
import ErrorSvg from './error.svg'

const { description = '数据获取失败', ...props } = defineProps<EmptyAppProps>()
const emits = defineEmits<{
  /** 重试 */
  retry: []
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
</script>

<style lang="less" scoped></style>
