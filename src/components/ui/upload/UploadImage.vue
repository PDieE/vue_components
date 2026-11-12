<!-- 图片上传组件 -->
<template>
  <div
    :class="
      cn('group ui-upload-image flex w-full flex-col gap-2', disabled && 'is-disabled', props.class)
    "
  >
    <UiImageViewer v-slot="{ open }" :images="previewImages">
      <div class="flex flex-wrap items-center gap-2">
        <!-- 点击上传触发元素 -->
        <div
          v-if="modelValue.length < count"
          :class="
            cn(
              'flex shrink-0 flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-[#e4e9f1] bg-[#f8fafc] p-2 transition-colors',
              !disabled && !readonly
                ? 'cursor-pointer hover:border-brand'
                : readonly
                  ? 'cursor-default'
                  : 'cursor-not-allowed opacity-60',
              triggerClass,
            )
          "
          :style="triggerStyle"
          role="button"
          :tabindex="!disabled && !readonly ? 0 : -1"
          :aria-disabled="disabled || readonly ? 'true' : undefined"
          @click="openFileDialog()"
          @keydown.enter.prevent="openFileDialog()"
          @keydown.space.prevent="openFileDialog()"
        >
          <Icon icon="icon-park-outline:plus" class="size-5 text-[#64748b]" aria-hidden="true" />
          <span class="whitespace-nowrap text-sm font-medium text-[#64748b]">点击上传</span>
        </div>

        <!-- 已上传图片 -->
        <div
          v-for="(file, index) in modelValue"
          :key="fileKey(file)"
          :class="
            cn(
              'group/image relative shrink-0 overflow-hidden rounded-md',
              !disabled && !readonly
                ? 'cursor-pointer'
                : readonly
                  ? 'cursor-default'
                  : 'cursor-not-allowed',
            )
          "
          :style="imageStyle"
          role="button"
          :tabindex="!disabled && !readonly ? 0 : -1"
          :aria-disabled="disabled || readonly ? 'true' : undefined"
          @click="openFileDialog()"
          @keydown.enter.prevent="openFileDialog()"
          @keydown.space.prevent="openFileDialog()"
        >
          <!-- 图片预览 -->
          <img
            v-if="getPreviewUrl(file)"
            :src="getPreviewUrl(file)"
            :alt="file.name"
            class="absolute inset-0 size-full rounded-[2px] object-cover"
          />

          <!-- 状态：上传中 - 始终显示进度遮罩 -->
          <div
            v-if="file.status === 'progress'"
            class="absolute inset-0 z-1 flex items-center justify-center rounded-md bg-black/60"
          >
            <svg
              class="-rotate-90 text-brand"
              :style="progressStyle"
              viewBox="0 0 36 36"
              role="progressbar"
              :aria-valuenow="Math.round(file.percent || 0)"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-hidden="true"
            >
              <circle cx="18" cy="18" r="14" stroke="#dbeafe" stroke-width="4" fill="none" />
              <circle
                cx="18"
                cy="18"
                r="14"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
                stroke-linecap="round"
                :stroke-dasharray="progressCircumference"
                :stroke-dashoffset="progressOffset(file)"
              />
            </svg>
          </div>

          <!-- 非上传中状态 - 悬浮显示操作按钮 -->
          <div
            v-else
            :class="
              cn(
                'mask absolute inset-0 z-1 flex items-center justify-center gap-4 rounded-md bg-black/60 opacity-0 transition-opacity group-hover/image:opacity-100',
                disabled && 'group-hover/image:opacity-0',
              )
            "
          >
            <!-- 状态：成功 - 查看按钮 -->
            <button
              v-if="file.status === 'success'"
              type="button"
              class="flex size-4 cursor-pointer items-center justify-center text-white transition-opacity hover:opacity-80"
              aria-label="查看图片"
              @click.stop="open(index)"
            >
              <Icon icon="lucide:eye" class="size-4" />
            </button>

            <!-- 状态：等待/失败 - 上传按钮 -->
            <button
              v-else-if="
                !readonly &&
                (file.status === 'waiting' || file.status === 'fail') &&
                showUploadButton
              "
              type="button"
              class="flex size-4 cursor-pointer items-center justify-center text-white transition-opacity hover:opacity-80"
              :disabled="disabled"
              :aria-label="file.status === 'fail' ? '点击重试' : '上传图片'"
              @click.stop="upload(file)"
            >
              <Icon
                :icon="
                  file.status === 'fail' ? 'icon-park-outline:refresh' : 'icon-park-outline:upload'
                "
                class="size-4"
              />
            </button>

            <!-- 删除按钮（始终存在） -->
            <button
              v-if="!readonly"
              type="button"
              class="flex size-4 cursor-pointer items-center justify-center text-white transition-opacity hover:opacity-80"
              :disabled="disabled"
              aria-label="删除图片"
              @click.stop="removeFile(file.id)"
            >
              <Icon icon="lucide:trash" class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </UiImageViewer>

    <!-- 提示信息 -->
    <p v-if="acceptTip" class="text-xs font-medium text-[#94a3b8]">{{ acceptTip }}</p>

    <!-- 文件选择框隐藏元素 -->
    <input
      ref="inputRef"
      class="hidden"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled || readonly"
      @input.stop
      @change.stop="handleInputChange"
    />
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { cloneDeep, isEqual, omit } from 'es-toolkit'
import { imageDimensionsFromData } from 'image-dimensions'
import { nanoid } from 'nanoid'
import prettyBytes from 'pretty-bytes'
import type { HTMLAttributes } from 'vue'
import { computed, onBeforeUnmount, ref } from 'vue'
import { toast } from 'vue-sonner'

import { cn } from '@/lib/utils'

import type { UploadFile } from '.'

/** accept 属性的对象形式 */
interface Accept {
  value: string
  type: 'mime' | 'ext' | 'all' | 'mistake'
}

const modelValue = defineModel<UploadFile[]>({ default: () => [] })
const fileMap = ref(new Map<string, UploadFile>())
const previewMap = ref(new Map<string, string>())
watchDebounced(
  modelValue,
  (v) => {
    if (
      isEqual(
        v.map((v) => omit(v, ['raw'])),
        Array.from(fileMap.value.values()).map((v) => omit(v, ['raw'])),
      )
    ) {
      return
    }

    fileMap.value = new Map(v.map((item) => [item.id, item]))
  },
  { immediate: true, debounce: 100, maxWait: 200 },
)

const {
  size = 80,
  sizeLimit = Infinity,
  minImageSize,
  maxImageSize,
  imageRatio,
  count = Infinity,
  accept = 'image/*',
  multiple = false,
  disabled = false,
  readonly = false,
  autoUpload = true,
  showUploadButton = true,
  triggerClass,
  ...props
} = defineProps<{
  class?: HTMLAttributes['class']
  /** 触发上传的元素类名，默认为空字符串 */
  triggerClass?: HTMLAttributes['class']
  /** 每个元素的尺寸，数字表示宽高一致；数组第一个为宽，第二个为高。默认为 80 */
  size?: number | [number, number]
  /** 上传文件大小限制，单位为字节 */
  sizeLimit?: number
  /** 图片最小尺寸限制，单位为像素 */
  minImageSize?: number | [number, number]
  /** 图片最大尺寸限制，单位为像素 */
  maxImageSize?: number | [number, number]
  /** 图片比例限制，例如 [16, 9] */
  imageRatio?: [number, number]
  /** 最多允许的文件数量，默认为不限制 */
  count?: number
  /** 原生 input accept，用于限制可选文件类型，默认为 image/* */
  accept?: string
  /** 是否允许一次选择多个文件 */
  multiple?: boolean
  /** 是否禁用上传组件 */
  disabled?: boolean
  /** 是否只读，只读时不可选择、上传或删除图片 */
  readonly?: boolean
  /** 是否在选中文件后自动上传；为 false 时可通过暴露的 upload 方法手动上传 */
  autoUpload?: boolean
  /** 是否显示上传按钮 */
  showUploadButton?: boolean
}>()

const emit = defineEmits<{
  /** 文件列表变化事件 */
  change: [modelValue: UploadFile[]]
  /** 校验或上传失败事件 */
  error: [message: string, file?: UploadFile | File]
}>()

const inputRef = ref<HTMLInputElement>()
const overCount = computed(() => fileMap.value.size >= count)

const previewImages = computed(() => modelValue.value.map((file) => getPreviewUrl(file) || ''))
const itemWidth = computed(() => (Array.isArray(size) ? size[0] : size))
const itemHeight = computed(() => (Array.isArray(size) ? size[1] : size))
const triggerStyle = computed(() => ({
  width: `${itemWidth.value}px`,
  height: `${itemHeight.value}px`,
}))
const imageStyle = computed(() => ({
  width: `${itemWidth.value}px`,
  height: `${itemHeight.value}px`,
}))
const progressStyle = computed(() => ({
  width: `${Math.round(itemWidth.value * 0.45)}px`,
  height: `${Math.round(itemHeight.value * 0.45)}px`,
}))
const acceptTip = computed(() => {
  const types = accept
    .split(',')
    .map((item) => item.trim().replace(/^\./, ''))
    .filter(Boolean)
  const limit =
    sizeLimit === Infinity
      ? ''
      : `，不超过${prettyBytes(sizeLimit, { binary: true }).replace('i', '')}`
  // accept 默认为 image/* 时，显示"支持任意图片格式"
  const onlyType = types[0]
  if (types.length === 1 && (onlyType === 'image/*' || onlyType === '*/*')) {
    return `支持任意图片格式${limit}`
  }
  if (types.length === 1 && onlyType?.startsWith('image/') && onlyType.endsWith('/*')) {
    return `支持任意图片格式${limit}`
  }
  const formatted = types.map((item) => item.replace(/^\./, '').toUpperCase()).join('，')
  return `支持${formatted}${limit}`
})
const progressCircumference = 2 * Math.PI * 14

/** 打开文件选择框 */
function openFileDialog() {
  if (disabled || readonly || overCount.value) {
    return
  }
  inputRef.value?.click()
}

/**
 * 手动触发上传。未传入文件时，会上传所有等待上传或上传失败的文件。
 */
async function upload(target?: UploadFile) {
  if (disabled || readonly) {
    return []
  }
  const targets = target
    ? [target]
    : Array.from(fileMap.value.values()).filter(
        (file) => file.raw && ['waiting', 'fail'].includes(file.status || ''),
      )

  const results: UploadFile[] = []
  for (const file of targets) {
    if (!file.raw) {
      continue
    }
    results.push(await uploadOne(file))
  }
  return results
}

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (readonly) {
    target.value = ''
    return
  }
  if (!target.files?.length) {
    return
  }
  void addFiles(Array.from(target.files))
  target.value = ''
}

async function addFiles(rawFiles: File[]) {
  if (readonly) return

  const selected = multiple ? rawFiles : rawFiles.slice(0, 1)
  const remainingCount = Math.max(0, count - fileMap.value.size)
  const allowedFiles = selected.slice(0, remainingCount)

  if (!allowedFiles.length) {
    warn(`文件数量不可超过 ${count} 份`)
    return
  }

  for (const rawFile of allowedFiles) {
    const valid = await beforeUpload(rawFile)
    if (!valid) {
      continue
    }

    const file: UploadFile = {
      id: nanoid(),
      name: rawFile.name,
      percent: 0,
      raw: rawFile,
      size: rawFile.size,
      status: autoUpload ? 'progress' : 'waiting',
      type: rawFile.type,
    }

    fileMap.value.set(file.id, file)
    previewMap.value.set(file.id, URL.createObjectURL(rawFile))
    updateFileList()

    if (autoUpload) {
      void uploadOne(file)
    }
  }
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

async function uploadOne(file: UploadFile) {
  setFileState(file.id, { status: 'progress', percent: file.percent || 0 })
  try {
    const url = await ossPreUploadFile(file.raw!, {
      onUploadProgress: (event) => {
        const percent =
          typeof event.progress === 'number'
            ? event.progress * 100
            : event.total
              ? (event.loaded / event.total) * 100
              : file.percent
        setFileState(file.id, { percent: Math.min(99, percent || 0) })
      },
    })
    setFileState(file.id, { status: 'success', percent: 100, url })
    // 上传成功后清理预览 blob，使用 url
    const previewUrl = previewMap.value.get(file.id)
    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    previewMap.value.set(file.id, url)
  } catch (error) {
    const message = error instanceof Error ? error.message : '文件上传失败'
    setFileState(file.id, { status: 'fail', percent: 0 })
    warn(message, file)
  }
  return file
}

/** 更新文件列表 */
function updateFileList() {
  const nextFiles = Array.from(fileMap.value.values())
  modelValue.value = nextFiles
  emit('change', cloneDeep(nextFiles))
}

/**
 * 更新文件状态
 * @param id 文件ID
 * @param patch 状态更新
 */
function setFileState(id: string, patch: Partial<UploadFile>) {
  const file = fileMap.value.get(id)
  if (file) {
    Object.assign(file, patch)
    fileMap.value.set(id, file)
    updateFileList()
  }
}

/**
 * 移除文件
 * @param id 文件ID
 */
function removeFile(id: string) {
  if (readonly) return

  const previewUrl = previewMap.value.get(id)
  if (previewUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl)
  }
  previewMap.value.delete(id)
  fileMap.value.delete(id)
  updateFileList()
}

function fileKey(file: UploadFile) {
  return `${file.name}-${file.size ?? 0}-${file.url ?? ''}-${file.status ?? ''}`
}

/**
 * 获取预览地址
 * @param file 文件
 */
function getPreviewUrl(file: UploadFile) {
  if (previewMap.value.has(file.id)) {
    return previewMap.value.get(file.id)
  }
  if (file.url) {
    return file.url
  }
  return ''
}

function progressOffset(file: UploadFile) {
  const percent = Math.max(0, Math.min(100, file.percent || 0))
  return progressCircumference * (1 - percent / 100)
}

/**
 * 错误警告
 * @param message 警告信息
 * @param file 关联的文件
 */
function warn(message: string, file?: UploadFile | File) {
  toast.warning(message, { position: 'top-center' })
  emit('error', message, file)
}

// 组件卸载时清理所有 blob URLs
onBeforeUnmount(() => {
  for (const url of previewMap.value.values()) {
    if (url?.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  }
  previewMap.value.clear()
})

defineExpose({
  /** 打开文件选择框 */
  openFileDialog,
  /** 上传等待中或指定的文件 */
  upload,
})
</script>
