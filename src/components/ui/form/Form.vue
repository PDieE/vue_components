<template>
  <form @submit.prevent="emits('submit', $event)">
    <UiFieldGroup v-if="!custom"><slot /></UiFieldGroup>
    <slot v-else />
  </form>
</template>

<script lang="ts" setup>
const emits = defineEmits<{
  submit: [e: SubmitEvent]
}>()

const { custom = false } = defineProps<{
  /** 是否禁用 */
  disabled?: boolean
  /** 是否自定义样式 */
  custom?: boolean
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
</script>

<style lang="less" scoped></style>
