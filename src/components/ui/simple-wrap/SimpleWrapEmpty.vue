<template>
  <UiEmptyApp v-bind="props" :description="description">
    <template v-if="$slots.media" #media><slot name="media" /></template>
    <template v-if="$slots.title" #title><slot name="title" /></template>
    <template v-if="$slots.description" #description><slot name="description" /></template>
    <template v-if="$slots.content" #content><slot name="content" /></template>
    <template v-if="$slots.default" #default><slot /></template>
  </UiEmptyApp>
</template>

<script lang="ts" setup>
import type { EmptyAppProps } from '../empty'

const { description = '暂无数据', ...props } = defineProps<EmptyAppProps>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
</script>

<style lang="less" scoped></style>
