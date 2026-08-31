<!-- The AMap SDK has no complete TypeScript declarations for these dynamic payloads. -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="relative h-full w-full overflow-hidden">
    <div :id="containerId" style="position: absolute; inset: 0; width: 100%; height: 100%"></div>
    <UiPopover v-if="!props.readonly" :open="hasData">
      <UiPopoverTrigger as-child>
        <div class="absolute left-2.5 top-2.5 w-80 bg-white rounded">
          <UiInputGroup class="overflow-hidden">
            <UiInputGroupInput
              v-model="searchValue"
              class="cursor-pointer"
              placeholder="搜索位置、地点"
              @input="onSearchChange($event.target.value ?? '')"
            />

            <UiInputGroupAddon align="inline-end">
              <Icon icon="icon-park-outline:search" />
            </UiInputGroupAddon>
          </UiInputGroup>
        </div>
      </UiPopoverTrigger>
      <UiPopoverContent
        class="w-(--reka-popover-trigger-width) space-y-1 max-h-101 overflow-y-auto p-0.5"
      >
        <div
          v-for="item in searchList"
          :key="item.id"
          @click="onSelect(item)"
          class="flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1.5 hover:bg-[#f5f5f5]"
        >
          <span>{{ item.name }}</span>
          <span class="text-xs text-[#999]">{{ item.district }}</span>
        </div>
      </UiPopoverContent>
    </UiPopover>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-explicit-any -- The AMap SDK exposes dynamic payloads. */
import { Icon } from '@iconify/vue'
import { throttle } from 'es-toolkit'
import { filter, first, get, size, uniqueId } from 'es-toolkit/compat'
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

import type { AMapSearchResult } from '.'
import { AmapService } from './amapService'

const props = withDefaults(
  defineProps<{
    /** 默认位置 */
    position?: [number, number]
    /** 默认位置名称 */
    positionLabel?: string
    /** 是否只读，只读时不可搜索或修改位置 */
    readonly?: boolean
  }>(),
  {
    readonly: false,
  },
)

onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  amapManager.destroy()
})

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const containerId = uniqueId('map-container-')
const searchValue = ref('')

const amapManager = new AmapService()
const searchList = ref<AMapSearchResult[]>([])

// 是否有数据
const hasData = computed(() => size(searchList.value) > 0)
/** 初始化地图 */
async function initMap() {
  await amapManager.startup()
  amapManager.renderMap(containerId, {
    zoom: 14, // 初始化地图级别
    pitch: 0,
    viewMode: '3D', // 地图模式
    dragEnable: !props.readonly,
    doubleClickZoom: !props.readonly,
    keyboardEnable: !props.readonly,
    scrollWheel: !props.readonly,
    touchZoom: !props.readonly,
    zoomEnable: !props.readonly,
  })

  if (!props.readonly) {
    amapManager.addDefaultControls()
  }

  // 初始化位置
  if (props.position) {
    amapManager.setCenter(props.position)
    amapManager.createMarker({
      position: props.position,
      draggable: !props.readonly,
      label: props.positionLabel
        ? {
            offset: new amapManager.getAMap.Pixel(0, -5),
            direction: 'top',
            content: props.positionLabel,
          }
        : undefined,
    })
  }

  // 注册事件
  amapManager.on('onMapClick', (e) => {
    if (props.readonly) return

    // 清除输入
    searchValue.value = ''
    searchList.value = []
    amapManager.clearMarkers()
    const offset = new amapManager.getAMap.Pixel(0, -5)
    const markerMap = amapManager.createMarker(
      {
        position: e.lnglat,
        draggable: true,
        label: {
          offset: offset,
          direction: 'top',
          content: '正在获取位置信息',
        },
      },
      {
        type: 'clickEvent',
        data: e,
      },
    )
    amapManager.geocoder(e.lnglat).then((res) => {
      markerMap.marker.setLabel({
        content: get(res, 'regeocode.formattedAddress', '选择的位置'),
      })
      markerMap.marker.setExtData({
        type: 'gencoder',
        data: get(res, 'regeocode', {}),
      })
      markerMap.position = e.lnglat
    })
  })

  amapManager.on('onMarkerDrag', (e, markerMap) => {
    if (props.readonly) return

    // 清除输入
    searchValue.value = ''
    searchList.value = []
    const marker = markerMap.marker
    marker.setLabel({
      content: '正在获取位置信息',
    })
    amapManager.geocoder(e.lnglat).then((res) => {
      markerMap.marker.setLabel({
        content: get(res, 'regeocode.formattedAddress', '选择的位置'),
      })
      markerMap.marker.setExtData({
        type: 'gencoder',
        data: get(res, 'regeocode', {}),
      })
      markerMap.position = e.lnglat
    })
  })
}
/**
 * 搜索地址
 * @param v 搜索文本
 */
async function onSearch(v: string) {
  if (props.readonly) return

  const result = await amapManager.search(v)
  searchList.value = filter(get(result, 'tips', []), (item) => !!item.id)
}
// 创建一个节流函数，每 500 毫秒执行一次
/** 搜索地址 - 节流 */
const onSearchChange = throttle(onSearch, 1000)
/**
 * 选中地址
 * @param item 选中的内容
 */
async function onSelect(item: AMapSearchResult) {
  if (props.readonly) return

  const info = (await amapManager.geocoder(item.location)) as any
  searchValue.value = info?.regeocode?.formattedAddress || `${item.district}${item.name}`
  // 选中的位置
  amapManager.clearMarkers()
  const offset = new amapManager.getAMap.Pixel(0, -5)
  amapManager.createMarker(
    {
      position: item.location,
      draggable: true,
      label: {
        offset: offset,
        // 位置
        direction: 'top',
        content: item.name,
      },
    },
    {
      type: 'search',
      data: item,
    },
    item.id,
  )
  amapManager.setCenter(item.location)
}
/** 获取选中的地图标记 */
async function getSelectMarker() {
  const markerList = amapManager.getMarkers
  if (size(markerList) === 0) {
    return null
  }
  const firstMarker = first(markerList)!
  const extData = firstMarker.marker.getExtData()
  const type = get(extData, 'type', '')
  const position = firstMarker.position
  if (type === 'search') {
    // 需要查询一遍
    const info = await amapManager.geocoder(position)
    return {
      position,
      extData: get(info, 'regeocode', {}),
    }
  } else {
    return {
      position,
      extData: extData.data,
    }
  }
}
/**
 * 设置地址
 * @param address 地址
 */
function setAddress(address: string) {
  searchValue.value = address
  const AMap = amapManager.getAMap
  try {
    const geocoder = new AMap.Geocoder({ extensions: 'all' })
    geocoder.getLocation(address, function (status: string, result: any) {
      if (status !== 'complete' || result.info !== 'OK' || !result.geocodes[0]) {
        return
      }

      const item = result.geocodes[0]

      amapManager.clearMarkers()
      const offset = new amapManager.getAMap.Pixel(0, -5)
      amapManager.createMarker(
        {
          position: item.location,
          draggable: true,
          label: {
            offset: offset,
            direction: 'top',
            content: item.formattedAddress,
          },
        },
        {
          type: 'search',
          data: item,
        },
      )
      amapManager.setCenter(item.location)
      amapManager.map.setZoom(17, false, 200)
    })
  } catch {
    setTimeout(() => {
      setAddress(address)
    }, 200)
  }
}

defineExpose({ amapManager, getSelectMarker, setAddress })
</script>
