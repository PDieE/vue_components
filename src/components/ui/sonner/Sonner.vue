<script lang="ts" setup>
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from '@lucide/vue'
import type { ToasterProps } from 'vue-sonner'
import { Toaster as Sonner } from 'vue-sonner'

import { cn } from '@/lib/utils'

const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner
    :class="cn('toaster group pointer-events-auto', props.class)"
    :style="{
      '--border-radius': 'var(--radius)',
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--success-bg': 'var(--success)',
      '--success-border': 'transparent',
      '--success-text': 'var(--success-foreground)',
      '--info-bg': 'var(--brand-bg)',
      '--info-border': 'transparent',
      '--info-text': 'var(--brand)',
      '--warning-bg': 'var(--warning)',
      '--warning-border': 'transparent',
      '--warning-text': 'var(--warning-foreground)',
      '--error-bg': 'var(--error)',
      '--error-border': 'transparent',
      '--error-text': 'var(--error-foreground)',
    }"
    v-bind="props"
    richColors
  >
    <template #success-icon>
      <CircleCheckIcon class="size-4" />
    </template>
    <template #info-icon>
      <InfoIcon class="size-4" />
    </template>
    <template #warning-icon>
      <TriangleAlertIcon class="size-4" />
    </template>
    <template #error-icon>
      <OctagonXIcon class="size-4" />
    </template>
    <template #loading-icon>
      <div>
        <Loader2Icon class="size-4 animate-spin" />
      </div>
    </template>
    <template #close-icon>
      <XIcon class="size-4" />
    </template>
  </Sonner>
</template>
