<template>
  <UiEmpty>
    <UiEmptyHeader>
      <UiEmptyMedia variant="icon">
        <Icon icon="icon-park-outline:folder-open" />
      </UiEmptyMedia>
      <UiEmptyTitle v-if="title">{{ title }}</UiEmptyTitle>
      <UiEmptyDescription v-if="desc">{{ desc }}</UiEmptyDescription>
    </UiEmptyHeader>
    <UiEmptyContent v-if="$slots.content">
      <slot name="content"></slot>
    </UiEmptyContent>
    <slot name="after"></slot>
  </UiEmpty>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'

import type { EmptyProps } from '.'

const { title = '暂无数据', desc } = defineProps<EmptyProps>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
</script>

<style lang="less" scoped></style>
