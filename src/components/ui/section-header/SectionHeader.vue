<script setup lang="ts">
import { Icon } from '@iconify/vue';

const { title, icon } = defineProps<{
  /** 标题 */
  title: string;
  /** 图标名称，可通过 icon 插槽覆盖 */
  icon?: string;
}>();
</script>

<template>
  <section class="flex items-center gap-3">
    <div
      v-if="icon || $slots.icon"
      class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-bg text-brand"
    >
      <slot name="icon">
        <Icon v-if="icon" :icon="icon" class="size-4" />
      </slot>
    </div>
    <h3 class="min-w-0 flex-1 truncate text-sm font-black text-foreground">{{ title }}</h3>

    <div v-if="$slots.actions" class="shrink-0 space-x-2">
      <slot name="actions" />
    </div>
  </section>
</template>
