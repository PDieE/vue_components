import { useMutation } from '@tanstack/vue-query'
import { shallowRef } from 'vue'

/**
 * 通用启用/停用钩子。
 * @param opt 状态切换配置
 */
export function useStatus<T extends { status: unknown }, V = unknown, R = unknown>(opt: {
  /** 状态字段名，默认为 status。 */
  key?: keyof T
  /** 状态切换方法，接收记录和目标状态。 */
  fn: (data: T, value: V) => Promise<R>
  /** 切换成功回调，接收请求结果、记录和目标状态。 */
  onSuccess?: (result: R, data: T, value: V) => void | Promise<void>
  /** 切换失败回调，字段恢复原值后执行，接收错误、记录和目标状态。 */
  onError?: (error: Error, data: T, value: V) => void | Promise<void>
}) {
  const { key = 'status', fn, onSuccess, onError } = opt

  /** 最近一次提交状态切换的记录，保留原始对象引用以便匹配。 */
  const toggleData = shallowRef<T>()
  const { mutate, isPending: isToggling } = useMutation<
    R,
    Error,
    { data: T; value: V; previousValue: T[keyof T] }
  >({
    mutationFn: ({ data, value }) => fn(data, value),
    onSuccess: (result, { data, value }) => {
      data[key] = value as T[keyof T]
      return onSuccess?.(result, data, value)
    },
    onError: (error, { data, value, previousValue }) => {
      data[key] = previousValue
      return onError?.(error, data, value)
    },
  })

  /** 启用/停用记录，请求期间忽略重复提交。 */
  function toggle(data: T, value: V) {
    if (isToggling.value) return

    toggleData.value = data
    mutate({ data, value, previousValue: data[key] })
  }

  return { toggle, toggleData, isToggling }
}
