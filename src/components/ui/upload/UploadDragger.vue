<!-- 上传组件 -->
<template>
  <div
    :class="
      cn(
        'group ui-upload-dragger flex w-full flex-col gap-4',
        disabled && 'is-disabled',
        isReadonlyStyle && 'is-readonly',
        props.class,
      )
    "
  >
    <div
      :class="
        cn(
          'flex w-full items-center justify-center gap-4 rounded-md border border-dashed border-[#e4e9f1] bg-[#f8fafc] px-4 py-8 transition-colors',
          !disabled && !isReadonlyStyle && 'cursor-pointer hover:border-brand',
          isReadonlyStyle && 'cursor-default',
          dragging && !disabled && !isReadonlyStyle && 'border-brand bg-brand/5',
          disabled && 'cursor-not-allowed opacity-60',
          'group-aria-invalid:border-destructive',
        )
      "
      role="button"
      :tabindex="!disabled && !readonly ? 0 : -1"
      :aria-disabled="disabled || readonly ? 'true' : undefined"
      @click="openFileDialog()"
      @keydown.enter.prevent="openFileDialog()"
      @keydown.space.prevent="openFileDialog()"
      @dragenter.prevent="handleDragEnter"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <slot>
        <UploadFolderIcon class="h-11.75 w-15 shrink-0" aria-hidden="true" />
        <div class="flex shrink-0 flex-col items-start gap-1 overflow-hidden text-center">
          <p class="whitespace-nowrap text-sm font-medium leading-5.5 text-[#475569]">
            <slot name="label">点击或拖拽文件到此处上传</slot>
          </p>
          <p class="whitespace-nowrap text-xs font-normal leading-5 text-[#94a3b8]">
            {{ acceptTip }}
          </p>
        </div>
      </slot>
    </div>

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

    <!-- 文件列表 -->
    <div v-if="showFileList && modelValue.length" class="flex w-full flex-col gap-3">
      <div
        v-for="file in modelValue"
        :key="fileKey(file)"
        class="flex w-full items-center gap-3 rounded-md"
      >
        <div class="flex min-w-0 flex-1 items-center rounded-md bg-[#f8fafc] px-3 py-1.75">
          <div class="flex min-w-0 flex-1 items-center gap-3">
            <component :is="fileIcon(file)" class="size-6 shrink-0" aria-hidden="true" />
            <div class="min-w-0 text-sm font-medium leading-5.5 text-[#475569]">
              <span :class="['block truncate', file.status === 'fail' && 'text-destructive']">{{
                file.name
              }}</span>
            </div>
          </div>

          <!-- 状态：成功 -->
          <UiButton
            v-if="file.status === 'success' && file.url"
            class="group/button"
            :disabled="disabled"
            variant="ghost"
            size="icon-xs"
            as="a"
            :href="file.url"
            :download="file.name"
            target="_blank"
            aria-label="下载文件"
            @click.stop
          >
            <template #icon>
              <Icon
                class="text-foreground-2 transition-all group-hover/button:text-foreground"
                icon="icon-park-outline:download"
              />
            </template>
          </UiButton>

          <!-- 状态：等待 -->
          <UiButton
            v-if="!readonly && file.status === 'waiting' && showUploadButton"
            class="group/button"
            :disabled="disabled"
            variant="ghost"
            size="icon-xs"
            aria-label="上传文件"
            @click.stop="upload(file)"
          >
            <template #icon>
              <Icon
                class="text-foreground-2 transition-all group-hover/button:text-foreground"
                icon="icon-park-outline:upload"
              />
            </template>
          </UiButton>

          <!-- 状态：上传中 -->
          <div
            v-if="file.status === 'progress'"
            class="relative size-4 shrink-0 text-brand"
            role="progressbar"
            :aria-valuenow="Math.round(file.percent || 0)"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <svg class="size-4 -rotate-90" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="6" stroke="#dbeafe" stroke-width="4" fill="none" />
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
                stroke-linecap="round"
                :stroke-dasharray="progressCircumference"
                :stroke-dashoffset="progressOffset(file)"
              />
            </svg>
          </div>

          <!-- 状态：失败 -->
          <UiButton
            v-if="!readonly && file.status === 'fail'"
            class="text-xs"
            :disabled="disabled"
            variant="ghost"
            theme="brand"
            size="xs"
            aria-label="点击重试"
            @click.stop="upload(file)"
          >
            点击重试
          </UiButton>
        </div>

        <UiButton
          v-if="!readonly"
          class="group/button"
          :disabled="disabled"
          variant="ghost"
          theme="destructive"
          size="icon-xs"
          aria-label="删除文件"
          @click.stop="removeFile(file.id)"
        >
          <template #icon>
            <Icon
              class="size-3 text-foreground-2 transition-all group-hover/button:text-destructive"
              icon="lucide:trash"
            />
          </template>
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { cloneDeep, isEqual, omit } from 'es-toolkit'
import { imageDimensionsFromData } from 'image-dimensions'
import { nanoid } from 'nanoid'
import prettyBytes from 'pretty-bytes'
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

import FileExcelIcon from '@/assets/svg/upload/file-excel.svg'
import FileGenericIcon from '@/assets/svg/upload/file-generic.svg'
import FileImageIcon from '@/assets/svg/upload/file-image.svg'
import FilePdfIcon from '@/assets/svg/upload/file-pdf.svg'
import FilePptIcon from '@/assets/svg/upload/file-ppt.svg'
import FileWordIcon from '@/assets/svg/upload/file-word.svg'
import UploadFolderIcon from '@/assets/svg/upload/upload-folder.svg'
import { cn } from '@/lib/utils'

import type { UploadFile } from '.'

/** accept 属性的对象形式 */
interface Accept {
  value: string
  type: 'mime' | 'ext' | 'all' | 'mistake'
}

const modelValue = defineModel<UploadFile[]>({ default: () => [] })
const fileMap = ref(new Map<string, UploadFile>())
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
  sizeLimit = Infinity,
  minImageSize,
  maxImageSize,
  imageRatio,
  count = Infinity,
  accept,
  multiple = false,
  disabled = false,
  readonly = false,
  autoUpload = true,
  showUploadButton = true,
  showFileList = true,
  uploadDir = '',
  ...props
} = defineProps<{
  class?: HTMLAttributes['class']
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
  /** 原生 input accept，用于限制可选文件类型 */
  accept?: string
  /** 是否允许一次选择多个文件 */
  multiple?: boolean
  /** 是否禁用上传组件 */
  disabled?: boolean
  /** 是否只读，只读时不可选择、上传或删除文件 */
  readonly?: boolean
  /** 是否在选中文件后自动上传；为 false 时可通过暴露的 upload 方法手动上传 */
  autoUpload?: boolean
  /** 是否显示上传按钮 */
  showUploadButton?: boolean
  /** 是否显示文件列表 */
  showFileList?: boolean
  /** OSS pre-upload objectName directory, e.g. /ota */
  uploadDir?: string
}>()

const emit = defineEmits<{
  /** 文件列表变化事件 */
  change: [modelValue: UploadFile[]]
  /** 校验或上传失败事件 */
  error: [message: string, file?: UploadFile | File]
}>()

const inputRef = ref<HTMLInputElement>()
const dragging = ref(false)
const dragDepth = ref(0)
const overCount = computed(() => count !== 1 && fileMap.value.size >= count)
const isReadonlyStyle = computed(() => readonly || overCount.value)
const acceptTip = computed(() => {
  if (!accept) {
    return sizeLimit === Infinity
      ? '支持任意格式'
      : `最大${prettyBytes(sizeLimit, { binary: true }).replace('i', '')}`
  }
  const types = accept
    .split(',')
    .map((item) => item.trim().replace(/^\./, '').toUpperCase())
    .filter(Boolean)
    .join('，')
  const limit =
    sizeLimit === Infinity
      ? ''
      : `(最大${prettyBytes(sizeLimit, { binary: true }).replace('i', '')})`
  return `支持${types}${limit}`
})
const progressCircumference = 2 * Math.PI * 6

/** 打开文件选择框 */
function openFileDialog() {
  if (overCount.value) {
    warn(`文件数量已达到上限 ${count} 份`)
    return
  }
  if (disabled || readonly) {
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

function handleDragEnter() {
  if (disabled || readonly) {
    return
  }
  dragDepth.value += 1
  dragging.value = true
}

function handleDragOver(event: DragEvent) {
  if (disabled || readonly) {
    return
  }
  event.dataTransfer!.dropEffect = 'copy'
}

function handleDragLeave() {
  dragDepth.value = Math.max(0, dragDepth.value - 1)
  dragging.value = dragDepth.value > 0
}

function handleDrop(event: DragEvent) {
  dragDepth.value = 0
  dragging.value = false
  if (disabled || readonly || !event.dataTransfer?.files?.length) {
    return
  }
  void addFiles(Array.from(event.dataTransfer.files))
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

  if (count === 1) {
    const rawFile = rawFiles[0]
    if (!rawFile) {
      return
    }

    const valid = await beforeUpload(rawFile)
    if (!valid) {
      return
    }

    const file = createUploadFile(rawFile)
    fileMap.value = new Map([[file.id, file]])
    updateFileList()

    if (autoUpload) {
      void uploadOne(file)
    }
    return
  }

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

    const file = createUploadFile(rawFile)

    fileMap.value.set(file.id, file)
    updateFileList()

    if (autoUpload) {
      void uploadOne(file)
    }
  }
}

function createUploadFile(rawFile: File): UploadFile {
  return {
    id: nanoid(),
    name: rawFile.name,
    percent: 0,
    raw: rawFile,
    size: rawFile.size,
    status: autoUpload ? 'progress' : 'waiting',
    type: rawFile.type,
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
  if (!accept) {
    return [{ value: '*', type: 'all' }]
  }

  return accept.split(',').map((v) => {
    const value = v.trim()
    let type: Accept['type'] = 'ext'
    if (value === '*') {
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
      dir: uploadDir,
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

  fileMap.value.delete(id)
  updateFileList()
}

function fileIcon(file: UploadFile): string {
  const ext = file.name?.split('.').pop()?.toLowerCase() || ''
  if (
    file.type?.startsWith('image/') ||
    ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)
  ) {
    return FileImageIcon
  }
  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return FileExcelIcon
  }
  if (ext === 'pdf') {
    return FilePdfIcon
  }
  if (['ppt', 'pptx'].includes(ext)) {
    return FilePptIcon
  }
  if (['doc', 'docx'].includes(ext)) {
    return FileWordIcon
  }
  // if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
  //   return FileArchiveIcon;
  // }
  return FileGenericIcon
}

function fileKey(file: UploadFile) {
  return `${file.name}-${file.size ?? 0}-${file.url ?? ''}-${file.status ?? ''}`
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

defineExpose({
  /** 打开文件选择框 */
  openFileDialog,
  /** 上传等待中或指定的文件 */
  upload,
})
</script>
