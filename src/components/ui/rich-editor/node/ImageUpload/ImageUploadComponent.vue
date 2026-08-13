<template>
  <node-view-wrapper class="w-full max-full">
    <ProgressRoot
      v-model="progress"
      class="relative flex h-16 w-full items-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
    >
      <!-- 进度条背景 -->
      <ProgressIndicator
        class="bg-purple-50 h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
        :style="`transform: translateX(-${100 - progress}%)`"
      />
      <div class="absolute inset-0 flex items-center px-4">
        <div
          class="flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-[#6b4bf5] text-white"
        >
          <Icon icon="lucide:cloud-upload" class="h-6 w-6" />
        </div>
        <div class="ml-3 flex flex-col justify-center overflow-hidden mr-3">
          <span class="truncate text-sm font-medium text-gray-900 leading-tight">
            {{ file?.name || '未知文件' }}
          </span>
          <span v-if="errorMessage" class="text-xs text-red-500 leading-tight mt-0.5">
            {{ errorMessage }}
          </span>
          <span v-else class="text-xs text-gray-500 leading-tight mt-0.5">
            {{ formatFileSize(file?.size || 0) }}
          </span>
        </div>
        <div class="ml-auto flex items-center gap-3">
          <span v-if="!errorMessage" class="text-sm font-medium text-[#6b4bf5]">
            {{ progress }}%
          </span>
          <button
            v-if="errorMessage && canRetry"
            class="cursor-pointer bg-transparent border-none rounded-0.75 flex items-center justify-center size-6 text-gray-400 hover:text-gray-600"
            title="重试"
            @click="doUpload"
          >
            <Icon icon="tdesign:refresh" class="text-4" />
          </button>
          <button
            class="cursor-pointer bg-transparent border-none rounded-0.75 flex items-center justify-center size-6 text-gray-400 hover:text-gray-600"
            @click="removeNode"
          >
            <Icon icon="tdesign:close" class="text-4" />
          </button>
        </div>
      </div>
    </ProgressRoot>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { imageDimensionsFromData } from 'image-dimensions'
import prettyBytes from 'pretty-bytes'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { computed, onBeforeMount, shallowRef } from 'vue'

import { useBridgeStore } from '../../injectionState'

const { node, deleteNode, getPos, editor } = defineProps(nodeViewProps)

onBeforeMount(() => {
  doUpload()
})

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const bridgeStore = useBridgeStore()
const {
  sizeLimit = Infinity,
  minImageSize,
  maxImageSize,
  imageRatio,
  accept = 'image/*',
} = bridgeStore?.imageUpload ?? {}
const file = computed(() => {
  const f = node.attrs.file
  return f instanceof File ? f : undefined
})

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const removeNode = () => {
  deleteNode()
}
const progress = shallowRef(0)
const errorMessage = shallowRef('')
const canRetry = shallowRef(false)

/** accept 属性的对象形式 */
interface Accept {
  value: string
  type: 'mime' | 'ext' | 'all' | 'mistake'
}

/**
 * 上传前校验。
 * @param file 要上传的文件
 */
async function beforeUpload(file: File) {
  if (file.size > sizeLimit) {
    warn(`${file.name} 超过 ${prettyBytes(sizeLimit, { binary: true }).replace('i', '')}`, file)
    return false
  }

  if (!acceptCheck(file)) {
    warn(`${file.name} 的类型不符合要求`, file)
    return false
  }

  return imageSizeCheck(file)
}

const acceptList = computed<Accept[]>(() => {
  return accept.split(',').map((v) => {
    const value = v.trim()
    let type: Accept['type'] = 'ext'
    if (value === '*' || value === '*/*') {
      type = 'all'
    } else if (value.startsWith('.')) {
      type = 'ext'
    } else if (/^[a-zA-Z0-9-]+\/(\*|[a-zA-Z0-9-._]+)$/.test(value)) {
      type = 'mime'
    } else {
      type = 'mistake'
    }
    return { value, type }
  })
})

/**
 * 校验文件格式是否符合要求。
 * @param file 要校验的文件
 */
function acceptCheck(file: File) {
  const checkGate = {
    all: () => true,
    ext: (v: Accept) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      return ext === v.value.replace('.', '').toLowerCase()
    },
    mime: (v: Accept) => {
      const [type, subtype] = v.value.split('/')
      const [fileType, fileSubtype] = file.type.split('/')
      if (type !== fileType) {
        return false
      }
      return subtype === '*' || subtype === fileSubtype
    },
    mistake: () => false,
  }

  return acceptList.value.some((item) => checkGate[item.type]?.(item))
}

const imageSize = computed(() => {
  if (!minImageSize && !maxImageSize) {
    return undefined
  }
  let min: { width: number; height: number } | undefined = undefined
  let max: { width: number; height: number } | undefined = undefined
  if (typeof minImageSize === 'number') {
    min = { width: minImageSize, height: minImageSize }
  }
  if (Array.isArray(minImageSize)) {
    min = { width: minImageSize[0], height: minImageSize[1] }
  }
  if (typeof maxImageSize === 'number') {
    max = { width: maxImageSize, height: maxImageSize }
  }
  if (Array.isArray(maxImageSize)) {
    max = { width: maxImageSize[0], height: maxImageSize[1] }
  }
  return { min, max }
})

/**
 * 校验图片尺寸/比例是否符合要求。
 * @param file 要校验的文件
 */
async function imageSizeCheck(file: File) {
  if (!imageSize.value && !imageRatio) {
    return true
  }

  const arrayBuffer = await file.arrayBuffer()
  const image = imageDimensionsFromData(new Uint8Array(arrayBuffer))
  if (!image) {
    return true
  }

  const { min, max } = imageSize.value || {}
  if (min && image.width < min.width) {
    warn(`${file.name} 宽度小于 ${min.width}px`, file)
    return false
  }
  if (min && image.height < min.height) {
    warn(`${file.name} 高度小于 ${min.height}px`, file)
    return false
  }
  if (max && image.width > max.width) {
    warn(`${file.name} 宽度大于 ${max.width}px`, file)
    return false
  }
  if (max && image.height > max.height) {
    warn(`${file.name} 高度大于 ${max.height}px`, file)
    return false
  }

  if (imageRatio && image.width / image.height !== imageRatio[0] / imageRatio[1]) {
    warn(`${file.name} 的比例不符合 ${imageRatio[0]}:${imageRatio[1]}`, file)
    return false
  }

  return true
}

/**
 * 错误警告
 * @param message 警告信息
 * @param file 关联的文件
 */
function warn(message: string, file?: File) {
  errorMessage.value = message
  console.warn(message, file)
}

/** 进行上传 */
const doUpload = async () => {
  if (!file.value) {
    errorMessage.value = '文件不存在'
    canRetry.value = false
    return
  }
  // 校验文件
  const valid = await beforeUpload(file.value)
  if (!valid) {
    canRetry.value = false
    return
  }

  errorMessage.value = ''
  canRetry.value = true
  ossPreUploadFile(file.value, {
    onUploadProgress: (event) => {
      const percent =
        typeof event.progress === 'number'
          ? event.progress * 100
          : event.total
            ? (event.loaded / event.total) * 100
            : 0
      progress.value = Math.round(percent)
    },
  })
    .then((url) => {
      progress.value = 100
      const pos = getPos()
      if (typeof pos !== 'number') {
        return
      }
      const image = editor.schema.nodes.image
      if (!image) {
        return
      }
      const imageNode = image.create({ src: url })
      editor.view.dispatch(editor.state.tr.replaceWith(pos, pos + 1, imageNode))
    })
    .catch((error) => {
      errorMessage.value = error instanceof Error ? error.message : '图片上传失败'
      canRetry.value = true
      console.warn(error)
    })
}
</script>

<style></style>
