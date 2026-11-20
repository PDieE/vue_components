<template>
  <UiEmptyApp v-bind="props" :description="description ?? t('simpleWrap.loadFailed')">
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
          <template #icon><RefreshCcw /></template>{{ t('common.retry') }}
        </UiButton>
      </slot>
    </template>
    <template v-if="$slots.default" #default><slot /></template>
  </UiEmptyApp>
</template>

<script lang="ts" setup>
import { RefreshCcw } from '@lucide/vue'

import { useUiLocale } from '@/components/ui/config-provider'

import type { EmptyAppProps } from '../empty'
import ErrorSvg from './error.svg'

const { t } = useUiLocale()

const { description, ...props } = defineProps<EmptyAppProps>()
const emits = defineEmits<{
  /** 重试 */
  retry: []
}>()
</script>

<style lang="less" scoped></style>
