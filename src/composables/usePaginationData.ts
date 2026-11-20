import { debounce } from 'es-toolkit'
import { computed, type MaybeRefOrGetter, onBeforeMount, ref, shallowRef, toValue } from 'vue'

/** 原始分页参数：默认使用 current/size，接入项目时可替换为项目的参数类型，并同步调整 adapter */
type OriPaginationParams = {
  current: number
  size: number
}

/** 原始分页数据：接入项目时可替换为项目的响应类型，并同步调整 adapter */
type OriPaginationData<T> = {
  current: number
  records: T[]
  total: number
}

/** 适配器分页数据 */
interface AdapterPaginationData<T> {
  current: number
  records: T[]
  total: number
}

/** 适配器 */
const adapter = {
  /**
   * 获取分页参数
   * @param current 页码
   * @param size 每页大小
   */
  getPaginationParams: (current: number, size: number): OriPaginationParams => ({
    current,
    size,
  }),
  /**
   * 获取分页数据
   * @param res 分页数据
   */
  getPaginationData: <T>(res: OriPaginationData<T>): AdapterPaginationData<T> => res,
}

/**
 * 分页数据钩子
 * @param api 数据获取接口
 * @param opts 参数配置
 */
export function usePaginationData<T>(
  api: (params: OriPaginationParams) => Promise<OriPaginationData<T>>,
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

    const paginationParams = adapter.getPaginationParams(page.value, pageSize)

    api({
      ...paginationParams,
      ...filterFormData.value,
    })
      .then((res) => {
        const adapterRes = adapter.getPaginationData(res)

        page.value = Number(adapterRes.current)
        total.value = Number(adapterRes.total)
        list.value = adapterRes.records

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
