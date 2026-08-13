<!-- The AMap SDK has no complete TypeScript declarations for these dynamic payloads. -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <UiDialogApp
    v-model:open="visible"
    size="80vw"
    title="地址选择"
    description="点击地图直接选点，或在左上角搜索框输入地点名称进行快速定位，确认后点击“确定”即可完成选择"
  >
    <template #trigger>
      <UiInputGroup class="cursor-pointer" @click="toAMap()">
        <UiInputGroupInput
          class="cursor-pointer"
          :model-value="showLabel ? showLabel : initialAddress"
          placeholder="从地图选择地址"
          readonly
        />

        <UiInputGroupAddon align="inline-end">
          <Icon icon="icon-park-outline:local-pin" />
        </UiInputGroupAddon>
      </UiInputGroup>
    </template>

    <div class="h-[calc(100vh-300px)]">
      <MapSelectContainer
        ref="aMapContainerRef"
        :position="
          modelValue.longitude && modelValue.latitude
            ? [Number(modelValue.longitude), Number(modelValue.latitude)]
            : undefined
        "
        :positionLabel="showLabel"
        :readonly="readonly"
      />
    </div>
    <template v-if="!readonly" #footer>
      <UiDialogClose as-child>
        <UiButton class="min-w-20" variant="outline">
          {{ readonly ? '关闭' : '取消' }}
        </UiButton>
      </UiDialogClose>
      <UiButton class="min-w-20" theme="brand" :loading="finishLoading" @click="onFinish">
        确定
      </UiButton>
    </template>
  </UiDialogApp>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { get } from 'es-toolkit/compat'
import { useTemplateRef, ref, computed, unref, nextTick } from 'vue'
import { toast } from 'vue-sonner'

import { MapSelectContainer } from './'

interface ValueState {
  /** 地区编码 */
  adcode?: string
  /** 省份 */
  province?: string
  /** 城市 */
  city?: string
  /** 区域 */
  district?: string
  /** 街道 */
  township?: string
  /** 详细地址 */
  address?: string
  /** 格式化地址（省市区街道） */
  formattedAddress?: string
  /** 经度 */
  longitude?: number
  /** 纬度 */
  latitude?: number
}

defineOptions({ name: 'AMapSelect' })
const {
  /** 初始地址 */
  initialAddress,
  /** 是否只读，只读时仅可查看地图并关闭弹窗 */
  readonly = false,
} = defineProps<{
  size?: 'small' | 'middle' | 'large'
  initialAddress?: string
  readonly?: boolean
}>()
const modelValue = defineModel<Partial<ValueState>>({
  default: () => ({}),
})
const emits = defineEmits<{
  change: [value: ValueState]
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const aMapContainerRef = useTemplateRef('aMapContainerRef')
const finishLoading = ref<boolean>(false)

const showLabel = computed(() => {
  return (
    modelValue.value.formattedAddress ||
    [
      modelValue.value.province,
      modelValue.value.city,
      modelValue.value.district,
      modelValue.value.township,
      modelValue.value.address,
    ]
      .filter(Boolean)
      .join('') ||
    ''
  )
})

const visible = ref<boolean>(false)
/** 打开地图选择 */
async function toAMap() {
  if (!modelValue.value.formattedAddress && initialAddress) {
    await nextTick()
    aMapContainerRef.value?.setAddress(initialAddress)
  }
}
/** 确认选择 */
async function onFinish() {
  try {
    if (!unref(aMapContainerRef)) {
      return toast.error('地图未加载', { position: 'top-center' })
    }
    finishLoading.value = true
    const selectInfo = await unref(aMapContainerRef)?.getSelectMarker()
    // 这里需要处理一下数据
    save(formatData(selectInfo))
  } catch {
    toast.error('选择失败', { position: 'top-center' })
  } finally {
    finishLoading.value = false
  }
}
/** 处理并保存数据 */
function save(value: ValueState) {
  visible.value = false
  modelValue.value = value
  emits('change', value)
}
/** 格式化数据 */
function formatData(v: unknown): ValueState {
  const adcode = get(v, 'extData.addressComponent.adcode', '')
  const province = get(v, 'extData.addressComponent.province', '')
  const city = get(v, 'extData.addressComponent.city', '')
  const district = get(v, 'extData.addressComponent.district', '')
  const township = get(v, 'extData.addressComponent.township', '')

  const formattedAddress = get(v, 'extData.formattedAddress', '')
  const longitude = get(v, 'position.lng', 0)
  const latitude = get(v, 'position.lat', 0)
  // 从 address 中删除 province, city, district, township
  const address = formattedAddress
    .replace(province, '')
    .replace(city, '')
    .replace(district, '')
    .replace(township, '')

  return {
    adcode,
    province,
    city,
    district,
    township,
    address,
    formattedAddress,
    longitude,
    latitude,
  }
}
</script>

<style lang="less" scoped></style>
