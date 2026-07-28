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
          :model-value="showLabel ? showLabel : undefined"
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
          showData.longitude && showData.latitude
            ? [Number(showData.longitude), Number(showData.latitude)]
            : undefined
        "
        :positionLabel="showLabel"
        :readonly="props.readonly"
      />
    </div>
    <template v-if="!props.readonly" #footer>
      <UiDialogClose as-child>
        <UiButton class="min-w-20" variant="outline">
          {{ props.readonly ? '关闭' : '取消' }}
        </UiButton>
      </UiDialogClose>
      <UiButton class="min-w-20" theme="brand" :loading="finishLoading" @click="onFinish">
        确定
      </UiButton>
    </template>
  </UiDialogApp>
</template>

<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-explicit-any -- The AMap SDK exposes dynamic payloads. */
import { Icon } from '@iconify/vue'
import { get, reduce } from 'es-toolkit/compat'
import { useTemplateRef, ref, computed, unref, nextTick } from 'vue'
import { toast } from 'vue-sonner'

import { MapSelectContainer } from './'

type FieldsType =
  | 'adcode' // 地区编码
  | 'province' // 省份
  | 'city' // 城市
  | 'district' // 区域
  | 'township' // 街道
  | 'address' // 详细地址
  | 'formattedAddress' // 格式化地址 (省市区街道)
  | 'longitude' // 经度
  | 'latitude' // 纬度

type ValueType = number | string
type ValueState = ValueType[]
interface Props {
  valueKey: FieldsType | FieldsType[]
  size?: 'small' | 'middle' | 'large'
  /** 初始地址 */
  initialAddress?: string
  /** 是否只读，只读时仅可查看地图并关闭弹窗 */
  readonly?: boolean
}
defineOptions({ name: 'AMapSelect' })
const props = withDefaults(defineProps<Props>(), {
  valueKey: () => [],
  readonly: false,
})
const modelValue = defineModel<ValueState>('value', { default: () => [] })
const emits = defineEmits<{
  change: [value: ValueState]
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const aMapContainerRef = useTemplateRef('aMapContainerRef')
const showFields = computed(() => {
  if (typeof props.valueKey === 'string') {
    return props.valueKey.split(',')
  }

  return props.valueKey
})

const finishLoading = ref<boolean>(false)

// 根据 state 值展示 ui
const showData = computed(() => {
  const r = reduce(
    showFields.value,
    (acc, key, index) => {
      acc[key] = modelValue.value[index]
      return acc
    },
    {} as any,
  )
  return r
})
const showLabel = computed(() => {
  return (
    showData.value.formattedAddress ||
    [
      showData.value.province,
      showData.value.city,
      showData.value.district,
      showData.value.township,
      showData.value.address,
    ]
      .filter(Boolean)
      .join('') ||
    ' '
  )
})

const visible = ref<boolean>(false)
/** 打开地图选择 */
async function toAMap() {
  if (!modelValue.value?.length && props.initialAddress) {
    await nextTick()
    aMapContainerRef.value?.setAddress(props.initialAddress)
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
function save(v: unknown) {
  visible.value = false
  const r = reduce(
    showFields.value,
    (acc, current) => {
      acc.push(get(v, current, '') ?? '')
      return acc
    },
    [] as string[],
  )
  modelValue.value = r
  emits('change', r)
}
/** 格式化数据 */
function formatData(v: unknown) {
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
