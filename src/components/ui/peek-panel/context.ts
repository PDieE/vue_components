import { createInjectionState } from '@vueuse/core'
import { shallowRef, useId } from 'vue'

const [useProvidePeekPanel, useInjectPeekPanel] = createInjectionState(() => {
  const id = useId()

  /** 是否已收起 */
  const peek = shallowRef(false)

  return { id, peek }
})

export { useProvidePeekPanel, useInjectPeekPanel }
