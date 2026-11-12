<script setup lang="ts">
import type PhotoSwipe from 'photoswipe'
import type { SlideData } from 'photoswipe'

import 'photoswipe/style.css'
import { onBeforeUnmount, watch } from 'vue'

/** 当前预览图片的下标 */
const index = defineModel<number>('index', { default: 0 })
/** 是否显示图片预览 */
const visible = defineModel<boolean>('visible', { default: false })

const props = defineProps<{
  /** 需要预览的图片地址列表 */
  images: string[]
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
let viewer: PhotoSwipe | undefined
let requestId = 0
let isUnmounted = false

/** 将下标限制在图片列表范围内。 */
function getValidIndex(value: number) {
  return Math.min(Math.max(value, 0), props.images.length - 1)
}

/** 从指定下标打开预览，未传下标时使用当前下标。 */
function open(value = index.value) {
  if (isUnmounted || !props.images.length) {
    return
  }

  index.value = getValidIndex(value)
  visible.value = true
}

/** 获取 PhotoSwipe 必需的图片尺寸。 */
function getSlideData(src: string): Promise<SlideData> {
  return new Promise((resolve) => {
    const image = new Image()

    image.onload = () => {
      resolve({
        src,
        width: image.naturalWidth || 1,
        height: image.naturalHeight || 1,
      })
    }
    image.onerror = () => resolve({ src, width: 1, height: 1 })
    image.src = src
  })
}

/** 打开预览。 */
async function openViewer() {
  if (isUnmounted || viewer || !props.images.length) {
    return
  }

  const currentRequestId = ++requestId
  const dataSource = await Promise.all(props.images.map(getSlideData))

  if (!visible.value || currentRequestId !== requestId) {
    return
  }

  const { default: PhotoSwipe } = await import('photoswipe')

  if (!visible.value || currentRequestId !== requestId) {
    return
  }

  const instance = new PhotoSwipe({
    dataSource,
    index: getValidIndex(index.value),
    mainClass: 'ui-image-viewer',
    tapAction: false,
  })

  viewer = instance
  instance.on('change', () => {
    index.value = instance.currIndex
  })
  instance.on('close', () => {
    visible.value = false
  })
  instance.on('destroy', () => {
    if (viewer === instance) {
      viewer = undefined
    }
    if (visible.value && !isUnmounted) {
      void openViewer()
    }
  })
  instance.init()
}

/** 关闭预览，并取消尚未完成的打开请求。 */
function closeViewer() {
  requestId += 1
  viewer?.close()
}

watch(
  visible,
  (value) => {
    if (value) {
      void openViewer()
      return
    }
    closeViewer()
  },
  { immediate: true },
)

watch(index, (value) => {
  if (viewer && viewer.currIndex !== value) {
    viewer.goTo(getValidIndex(value))
  }
})

onBeforeUnmount(() => {
  isUnmounted = true
  requestId += 1
  viewer?.destroy()
})
</script>

<template>
  <slot :open="open" />
</template>

<style>
.ui-image-viewer.pswp {
  pointer-events: auto;
}

/* 预览期间始终显示顶部的缩放、关闭等操作。 */
.ui-image-viewer.pswp .pswp__hide-on-close {
  pointer-events: auto;
  opacity: 1;
}
</style>
