<script setup lang="ts">
import { useUiLocale } from '@/components/ui/config-provider'

import { useInjectFilterForm } from './context'

const { reset } = useInjectFilterForm()!

const { t } = useUiLocale()
</script>

<template>
  <div class="shrink-0 flex items-center gap-2.5 flex-wrap">
    <slot />
    <UiButton variant="outline" @click="reset()">{{ t('common.reset') }}</UiButton>
  </div>
</template>
