<script setup lang="ts">
import { useInjectFilterForm } from './context'

const { reset } = useInjectFilterForm()!
</script>

<template>
  <div class="shrink-0 flex items-center gap-2.5 flex-wrap">
    <slot />
    <UiButton variant="outline" @click="reset()">重置</UiButton>
  </div>
</template>
