<script setup lang="ts">
import { cloneDeep } from 'es-toolkit'
import { computed, nextTick, ref, watchEffect } from 'vue'

import type { TagProps, MapOption, MapOptionValue } from '.'

const {
  value,
  options = [],
  api,
  unknown = '未知',
  strict = false,
  color,
  shape,
  border,
  dot,
} = defineProps<
  {
    /** 值 */
    value?: MapOptionValue
    /** 选项 */
    options?: MapOption[]
    /** 远程获取 */
    api?: () => Promise<MapOption[]>
    /** 找不到时的缺省值 */
    unknown?: string
    /** 是否严格匹配 */
    strict?: boolean
  } & Omit<TagProps, 'class'>
>()

watchEffect(async () => {
  await nextTick()
  if (!api) {
    optionList.value = cloneDeep(options)
    return
  }
  api().then((res) => {
    optionList.value = cloneDeep([...options, ...res])
  })
})
/**
 * ====================
 *       基本逻辑
 * ====================
 */
const optionList = ref<MapOption[]>([])
const option = computed(() => {
  let opt = optionList.value.find((item) => {
    if (strict) return item.value === value
    return String(item.value) === String(value)
  })
  if (!opt) {
    opt = { label: unknown, value: '' }
  }
  return opt
})
</script>

<template>
  <UiTag :color="option.color || color" :shape="shape" :border="border" :dot="dot">
    {{ option.label }}
  </UiTag>
</template>
