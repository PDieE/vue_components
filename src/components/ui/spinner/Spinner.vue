<script setup lang="ts">
import { Loader2Icon } from '@lucide/vue'
import type { HTMLAttributes } from 'vue'

import { useUiLocale } from '@/components/ui/config-provider'
import { cn } from '@/lib/utils'

const { t } = useUiLocale()

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Loader2Icon
    role="status"
    :aria-label="t('common.loading')"
    :class="cn('size-4 animate-spin', props.class)"
  />
</template>
