<script setup lang="ts">
import { useProvidePeekPanel } from './context'

const { peek } = useProvidePeekPanel()
</script>

<template>
  <slot :peek="peek" />
</template>
