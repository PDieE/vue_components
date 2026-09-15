<script setup lang="ts">
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/vue'
import type { HTMLAttributes } from 'vue';

const { icon, iconClass, title, titleClass } = defineProps<{
  /** 图标 */
  icon?: string
  /** 图标类名 */
  iconClass?: HTMLAttributes['class']
  /** 标题 */
  title: string
  /** 标题类名 */
  titleClass?: HTMLAttributes['class']
}>()
</script>

<template>
  <div class="flex items-center gap-2 h-5.5">
    <slot name="icon"><Icon v-if="icon" :class="cn('text-sm', iconClass)" :icon="icon" /></slot>
    <div :class="cn('text-foreground-2 text-sm font-bold', titleClass)">
      <slot name="title">{{ title }}</slot>
    </div>
  </div>
</template>
