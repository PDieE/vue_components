import { debounce } from 'es-toolkit'
import { computed, type MaybeRefOrGetter, onBeforeMount, ref, shallowRef, toValue } from 'vue'

/**
 * 分页数据钩子
 * @param api 数据获取接口
 * @param opts 参数配置
 */
export function usePaginationData<T>(
  api:
    | ((params: PaginationParams) => Promise<PaginationData<T>>)
    | ((params: PaginationParams, data: any) => Promise<PaginationData<T>>),
  opts?: {
    /**
     * 请求参数
     */
    params?: MaybeRefOrGetter
    /**
     * 每页条数
     * @default ```10```
     */
    pageSize?: number
    /**
     * 是否立即发起请求
     * @default ```true```
     */
    immediate?: boolean
  },
) {
  onBeforeMount(() => {
    if (immediate) {
      fetchData()
    }
  })

  const { params, pageSize = 10, immediate = true } = { ...opts }

  const filterFormData = computed(() => {
    return params ? toValue(params) : {}
  })

  const page = shallowRef(1)
  const total = shallowRef(0)
  const list = ref<T[]>([])
  const status = shallowRef<'idle' | 'pending' | 'success' | 'error'>('idle')

  function change(current: number) {
    if (current === 1) {
      refresh()
      return
    }

    page.value = current
    fetchData()
  }

  /**
   * 获取分页数据
   */
  const fetchData = debounce(() => {
    status.value = 'pending'

    const paginationParams = {
      current: page.value,
      size: pageSize,
    }

    let promise: Promise<PaginationData<T>>
    if (api.length === 2) {
      promise = (api as (params: PaginationParams, data: any) => Promise<PaginationData<T>>)(
        paginationParams,
        filterFormData.value,
      )
    } else {
      promise = (api as (params: PaginationParams) => Promise<PaginationData<T>>)({
        ...paginationParams,
        ...filterFormData.value,
      })
    }

    promise
      .then((res) => {
        page.value = Number(res.current)
        total.value = Number(res.total)
        list.value = res.records

        status.value = 'success'
      })
      .catch((err) => {
        console.warn(err)
        status.value = 'error'
      })
  }, 300)

  /**
   * 完全刷新表格数据
   */
  function refresh() {
    page.value = 1
    fetchData()
  }

  /**
   * 刷新当前页，如果没有数据则会自动刷新上一页
   * @param lengthThreshold 列表长度阈值，默认为 0
   */
  function refreshCurrentPage(lengthThreshold = 0) {
    if (list.value.length <= lengthThreshold && page.value > 1) {
      page.value--
    }
    fetchData()
  }

  return { list, page, pageSize, total, change, status, refresh, refreshCurrentPage }
}
