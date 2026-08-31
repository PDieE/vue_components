<script setup lang="ts">
import { useInjectFilterForm } from './context'

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const { reset } = useInjectFilterForm()!
</script>

<template>
  <div class="shrink-0 flex items-center gap-2.5">
    <slot />
    <UiButton variant="outline" @click="reset()">重置</UiButton>
  </div>
</template>
