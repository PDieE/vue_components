<template>
  <UiEmpty>
    <UiEmptyHeader>
      <UiEmptyMedia variant="icon">
        <Icon class="text-destructive" icon="icon-park-outline:close-one" />
      </UiEmptyMedia>
      <UiEmptyTitle v-if="title">{{ title }}</UiEmptyTitle>
      <UiEmptyDescription v-if="desc">{{ desc }}</UiEmptyDescription>
    </UiEmptyHeader>
    <UiEmptyContent>
      <slot name="content">
        <UiButton theme="brand" @click="emits('retry')">
          <Icon icon="icon-park-outline:refresh-one" />重试
        </UiButton>
      </slot>
    </UiEmptyContent>
    <slot name="after"></slot>
  </UiEmpty>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'

import type { ErrorProps } from '.'

const { title = '数据获取失败', desc } = defineProps<ErrorProps>()
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
