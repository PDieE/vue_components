<script setup lang="ts">
import { ConfigProvider as RekaConfigProvider } from 'reka-ui'

import { resolveUiLocale } from './locales'

const props = defineProps<{ locale?: string }>()
</script>

<template>
  <RekaConfigProvider :locale="resolveUiLocale(props.locale)">
    <slot />
  </RekaConfigProvider>
</template>
