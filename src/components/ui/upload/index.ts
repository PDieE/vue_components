export { default as UploadDragger } from './UploadDragger.vue'
export { default as UploadImage } from './UploadImage.vue'

/** 上传文件 */
export interface UploadFile {
  /** 文件唯一标识 */
  id: string
  /** 文件名称 */
  name?: string
  /** 上传进度 */
  percent?: number
  /** 原始文件对象 */
  raw?: File
  /** 文件大小 */
  size?: number
  /**
   * 上传状态
   * @describe success: 上传成功; fail: 上传失败; progress: 上传中; waiting: 等待上传;
   */
  status?: 'success' | 'fail' | 'progress' | 'waiting'
  /** 文件类型 */
  type?: string
  /** 文件上传成功后的下载/访问地址 */
  url?: string
}

/**
 * 字符串/字符串数组转换为上传文件数组
 * @param strArr 字符串/字符串数组
 * @param opts.separator 分隔符，默认逗号
 */
export function strArr2UploadFiles(
  strArr?: string | string[],
  opts?: { separator?: string | RegExp },
): UploadFile[] {
  if (!strArr) return []

  const { separator = ',' } = opts || {}
  let arr: string[] = []
  if (Array.isArray(strArr)) {
    arr = strArr
  } else {
    arr = strArr?.split(separator) || []
  }

  return arr.map((url, index) => ({
    id: `${index}-${url}`,
    name: url.split('/').pop() || url,
    status: 'success',
    percent: 100,
    url,
  }))
}

/**
 * 上传文件数组转换为字符串数组
 * @param files 上传文件数组
 * @param opts.filter 过滤函数，默认保留已上传的文件
 */
export function UploadFiles2StrArr(
  files?: UploadFile[],
  opts?: {
    filter: (value: string | undefined, index: number, array: (string | undefined)[]) => unknown
  },
): string[] {
  if (!files) return []

  const { filter = Boolean } = opts || {}

  return files.map((file) => file.url).filter(filter) as string[]
}

/**
 * 上传文件数组转换为字符串
 * @param files 上传文件数组
 * @param opts.separator 分隔符，默认逗号
 * @param opts.filter 过滤函数，默认保留已上传的文件
 */
export function UploadFiles2Str(
  files?: UploadFile[],
  opts?: {
    separator?: string
    filter: (value: string | undefined, index: number, array: (string | undefined)[]) => unknown
  },
): string | undefined {
  if (!files) return undefined

  const { separator = ',', filter = Boolean } = opts || {}

  return UploadFiles2StrArr(files, { filter }).join(separator)
}
