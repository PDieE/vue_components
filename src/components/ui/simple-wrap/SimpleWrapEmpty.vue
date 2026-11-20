<template>
  <UiEmptyApp v-bind="props" :description="description ?? t('common.noData')">
    <template v-if="$slots.media" #media><slot name="media" /></template>
    <template v-if="$slots.title" #title><slot name="title" /></template>
    <template v-if="$slots.description" #description><slot name="description" /></template>
    <template v-if="$slots.content" #content><slot name="content" /></template>
    <template v-if="$slots.default" #default><slot /></template>
  </UiEmptyApp>
</template>

<script lang="ts" setup>
import { useUiLocale } from '@/components/ui/config-provider'

import type { EmptyAppProps } from '../empty'

const { t } = useUiLocale()

const { description, ...props } = defineProps<EmptyAppProps>()
</script>

<style lang="less" scoped></style>
