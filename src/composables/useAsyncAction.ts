import { useMutation } from '@tanstack/vue-query'
import { shallowRef } from 'vue'

/**
 * 通用异步操作钩子。
 * @param opt 操作配置
 */
export function useAsyncAction<T, R = unknown>(opt: {
  /** 异步方法，接收 execute 传入的数据。 */
  fn: (data: T) => Promise<R>
  /** 成功回调，接收操作结果和 execute 传入的数据。 */
  onSuccess?: (result: R, data: T) => void | Promise<void>
  /** 失败回调，接收错误和 execute 传入的数据。 */
  onError?: (error: Error, data: T) => void | Promise<void>
}) {
  const { fn, onSuccess, onError } = opt

  /** 最近一次提交的数据，保留原始对象引用以便匹配。 */
  const actionData = shallowRef<T>()
  const { mutate, isPending } = useMutation<R, Error, T>({
    mutationFn: fn,
    onSuccess,
    onError,
  })

  /**
   * 执行异步操作，执行期间忽略重复提交。
   * @param data 操作数据，传入 fn、actionData、onSuccess 和 onError
   */
  function execute(data: T) {
    if (isPending.value) return

    actionData.value = data
    mutate(data)
  }

  return { execute, actionData, isPending }
}
