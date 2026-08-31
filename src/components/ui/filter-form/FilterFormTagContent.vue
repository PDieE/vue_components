<script setup lang="ts">
import { useInjectFilterForm } from './context'

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const { moreCount } = useInjectFilterForm()!
</script>

<template>
  <Transition
    enter-active-class="animate-in fade-in-0 zoom-in-95 duration-200"
    leave-active-class="animate-out fade-out-0 zoom-out-95 duration-200"
  >
    <div v-if="moreCount > 0" class="flex items-start col-span-full">
      <span class="text-sm leading-6">筛选项：</span>
      <div class="flex-1 flex flex-wrap gap-2">
        <TransitionGroup
          enter-active-class="animate-in fade-in-0 zoom-in-95 duration-200"
          leave-active-class="animate-out fade-out-0 zoom-out-95 duration-200"
        >
          <slot />
        </TransitionGroup>
      </div>
    </div>
  </Transition>
</template>
