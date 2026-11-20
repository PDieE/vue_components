<script setup lang="ts">
import { PanelLeft } from '@lucide/vue'
import type { HTMLAttributes } from 'vue'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useUiLocale } from '@/components/ui/config-provider'

import { useSidebar } from './utils'

const { t } = useUiLocale()

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { toggleSidebar } = useSidebar()
</script>

<template>
  <Button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="ghost"
    size="icon"
    :class="cn('h-7 w-7', props.class)"
    @click="toggleSidebar"
  >
    <PanelLeft />
    <span class="sr-only">{{ t('sidebar.toggle') }}</span>
  </Button>
</template>
