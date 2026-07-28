import { createInjectionState } from '@vueuse/core'
import type { Ref } from 'vue'

const [useProvideFilterForm, useInjectFilterForm] = createInjectionState(
  <TForm extends Record<string, unknown>>(
    filterForm: Ref<TForm>,
    reset: () => void,
    moreCount: ComputedRef<number>,
  ) => {
    const hasMore = shallowRef(false)
    /**
     * 注册是否有更多筛选组件
     * @param register 是否注册
     */
    function registerMore(register: boolean = true) {
      hasMore.value = register
    }

    const hasAction = shallowRef(false)
    /**
     * 注册是否有操作按钮组件
     * @param register 是否注册
     */
    function registerAction(register: boolean = true) {
      hasAction.value = register
    }
    return { filterForm, reset, hasMore, registerMore, hasAction, registerAction, moreCount }
  },
)

export { useProvideFilterForm, useInjectFilterForm }
