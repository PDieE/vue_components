<script setup lang="ts">
import { cloneDeep } from 'es-toolkit'
import { computed, nextTick, ref, watchEffect } from 'vue'

import type { TagProps, MapOption, MapOptionValue } from '.'

const {
  values,
  options = [],
  api,
  unknown = '-',
  strict = false,
  color,
  shape,
  border,
  dot,
} = defineProps<
  {
    /** 值 */
    values?: MapOptionValue[]
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
const vals = computed(() => {
  if (!values) return []
  if (strict) return values
  return values.map(String)
})
const displayOptions = computed(() =>
  optionList.value.filter((item) => {
    if (strict) return vals.value.includes(item.value)
    return vals.value.includes(String(item.value))
  }),
)
</script>

<template>
  <div v-if="displayOptions.length" class="flex flex-wrap gap-1">
    <UiTag
      v-for="option in displayOptions"
      :key="String(option.value)"
      :color="option.color || color"
      :shape="shape"
      :border="border"
      :dot="dot"
    >
      {{ option.label }}
    </UiTag>
  </div>
  <template v-else-if="unknown">{{ unknown }}</template>
</template>
