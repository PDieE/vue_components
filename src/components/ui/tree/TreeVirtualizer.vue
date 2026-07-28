<script setup lang="ts">
import type { TreeVirtualizerProps } from 'reka-ui'

const props = defineProps<TreeVirtualizerProps>()
</script>

<template>
  <RkTreeVirtualizer v-slot="slots" v-bind="props">
    <slot v-bind="slots" />
  </RkTreeVirtualizer>
</template>
