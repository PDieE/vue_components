<script setup lang="ts">
import { cloneDeep } from 'es-toolkit'
import { computed, nextTick, ref, watchEffect } from 'vue'

import { getMapOption } from '@/lib/map'
import { useUiLocale } from '@/components/ui/config-provider'

import type { TagProps, MapOptionValue } from '.'

const { t } = useUiLocale()

const {
  value,
  options = [],
  api,
  unknown,
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
const optionList = ref<MapOption[]>([])
const option = computed(() => getMapOption(optionList.value, value, strict))
</script>

<template>
  <UiTag :color="option?.color || color" :shape="shape" :border="border" :dot="dot">
    {{ option?.label ?? unknown ?? t('common.unknown') }}
  </UiTag>
</template>
