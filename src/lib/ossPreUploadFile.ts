import axios, { type AxiosRequestConfig } from 'axios'
import SparkMD5 from 'spark-md5'

/**
 * 模拟获取 OSS 预签名上传地址。
 *
 * 真实接口接入后，可直接替换为后端的 apiPreUploadUrl 调用。
 */
async function apiPreUploadUrl({ objectName }: { objectName: string }) {
  await new Promise((resolve) => window.setTimeout(resolve, 200))

  return {
    host: 'https://mock-oss.local',
    preUploadUrl: `https://mock-oss.local/upload/${encodeURIComponent(objectName)}`,
  }
}

/**
 * 通过阿里云oss预签名URL上传
 * @param file 文件
 * @param opts 选项
 */
export async function ossPreUploadFile(
  file: File,
  opts?: {
    /** 上传目录，默认为空字符串 */
    dir?: string
    /** 上传进度回调 */
    onUploadProgress?: AxiosRequestConfig['onUploadProgress']
  },
) {
  const { dir = '', onUploadProgress } = opts || {}
  try {
    let fileName = file.name

    if (!fileName) {
      const hash = await getFileHash(file)
      const ext = getFileExtension(file)
      fileName = ext ? `${dir}${dir ? '/' : ''}${hash}.${ext}` : `${dir}${dir ? '/' : ''}${hash}`
    }

    const objectName = dir ? `${dir}/${fileName}` : fileName
    const preUploadRes = await apiPreUploadUrl({ objectName })
    await axios.put(preUploadRes.preUploadUrl, file, { onUploadProgress })

    return Promise.resolve(`${preUploadRes.host}/${objectName}`)
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * 获取文件的hash值
 * @param file 文件
 */
function getFileHash(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = (ev) => {
      if (!ev.target) {
        reject(new Error('读取文件时出错'))
        return
      }
      const buffer = ev.target.result as ArrayBuffer
      const spark = new SparkMD5.ArrayBuffer()
      spark.append(buffer)
      const hash = spark.end()
      resolve(hash)
    }
  })
}

/**
 * 获取文件后缀名
 * @param file 文件
 */
function getFileExtension(file: File) {
  const lastDotIndex = file.name.lastIndexOf('.')
  return lastDotIndex === -1 ? '' : file.name.substring(lastDotIndex + 1)
}
