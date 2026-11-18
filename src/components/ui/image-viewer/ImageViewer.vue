<script setup lang="ts">
import type PhotoSwipe from 'photoswipe'
import type { SlideData } from 'photoswipe'
import type PhotoSwipeLightbox from 'photoswipe/lightbox'

import 'photoswipe/style.css'
import { onBeforeUnmount, watch } from 'vue'

/** 当前预览媒体的下标 */
const index = defineModel<number>('index', { default: 0 })
/** 是否显示媒体预览 */
const visible = defineModel<boolean>('visible', { default: false })

const props = defineProps<{
  /** 图片/视频地址列表 */
  images: string[]
}>()

let viewer: PhotoSwipe | undefined
let lightbox: PhotoSwipeLightbox | undefined
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

/** 优先使用媒体类型，缺失时从文件名或地址识别视频。 */
function isVideoMedia(src = '', type = '') {
  if (type === 'video' || type.startsWith('video/')) {
    return true
  }
  if (type === 'image' || type.startsWith('image/')) {
    return false
  }
  return /\.(mp4|webm|ogg|ogv|mov|m4v)(?:[?#]|$)/i.test(src) || /^data:video\//i.test(src)
}

/** 本地预览地址没有扩展名，通过 Blob 的 MIME 类型识别视频。 */
async function isVideoSource(src: string) {
  if (!src.startsWith('blob:')) {
    return isVideoMedia(src)
  }
  try {
    const response = await fetch(src)
    return isVideoMedia(src, response.headers.get('Content-Type') || '')
  } catch {
    return false
  }
}

/** 读取视频元数据；无法读取时使用默认比例，避免预览一直等待。 */
function getVideoDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    const finish = () => {
      const size = { width: video.videoWidth || 1280, height: video.videoHeight || 720 }
      clearTimeout(timer)
      video.onloadedmetadata = null
      video.onerror = null
      video.removeAttribute('src')
      video.load()
      resolve(size)
    }
    const timer = setTimeout(finish, 10000)
    video.onloadedmetadata = finish
    video.onerror = finish
    video.preload = 'metadata'
    video.src = src
  })
}

/** 获取 PhotoSwipe 必需的媒体类型与尺寸。 */
async function getSlideData(src: string): Promise<SlideData> {
  if (await isVideoSource(src)) {
    const dimensions = await getVideoDimensions(src)
    return {
      ...dimensions,
      type: 'video',
      videoSrc: src,
      // 插件通过封面完成内容加载，无封面时使用透明占位图。
      msrc: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
    }
  }
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

  const [{ default: Lightbox }, { default: VideoPlugin }] = await Promise.all([
    import('photoswipe/lightbox'),
    import('photoswipe-video-plugin'),
  ])

  if (!visible.value || currentRequestId !== requestId) {
    return
  }

  if (!lightbox) {
    const instance = new Lightbox({
      pswpModule: () => import('photoswipe'),
      mainClass: 'ui-image-viewer',
      tapAction: false,
    })
    new VideoPlugin(instance, {
      autoplay: true,
      videoAttributes: { controls: '', playsinline: '', preload: 'metadata' },
    })
    instance.on('init', () => {
      viewer = instance.pswp
    })
    instance.on('change', () => {
      if (instance.pswp) {
        index.value = instance.pswp.currIndex
      }
    })
    instance.on('close', () => {
      visible.value = false
    })
    instance.on('destroy', () => {
      viewer = undefined
      if (visible.value && !isUnmounted) {
        // 等待 Lightbox 清理旧实例后再打开。
        queueMicrotask(() => void openViewer())
      }
    })
    instance.init()
    lightbox = instance
  }
  if (!lightbox.loadAndOpen(getValidIndex(index.value), dataSource)) {
    visible.value = false
  }
}

/** 关闭预览，并取消尚未完成的打开请求。 */
function closeViewer() {
  requestId += 1
  if (lightbox) {
    lightbox.shouldOpen = false
  }
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
  lightbox?.destroy()
})
</script>

<template>
  <slot :open="open" />
</template>

<style>
.ui-image-viewer.pswp {
  pointer-events: auto;
}

.ui-image-viewer.pswp video {
  /* 与 PhotoSwipe 的图片样式保持一致，避免全局 max-width 将视频压缩为 0。 */
  max-width: none;
  object-fit: contain;
}

/* 预览期间始终显示顶部的缩放、关闭等操作。 */
.ui-image-viewer.pswp .pswp__hide-on-close {
  pointer-events: auto;
  opacity: 1;
}
</style>
