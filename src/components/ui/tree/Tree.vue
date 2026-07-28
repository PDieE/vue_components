<script
  setup
  lang="ts"
  generic="
    T extends Record<string, unknown>,
    U extends Record<string, unknown>,
    M extends boolean = false
  "
>
import { useQuery } from '@tanstack/vue-query'
import { cloneDeep, isEqual, omit } from 'es-toolkit'
import type {
  FlattenedItem,
  ListboxItemSelectEvent,
  TreeItemToggleEvent,
  TreeRootProps,
  TreeVirtualizerProps,
} from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import type { BadgeProps } from '@/components/ui/badge'

const modelValue = defineModel<M extends true ? U[] : U>()
const expanded = defineModel<string[]>('expanded', { default: () => [] })
const props = withDefaults(
  defineProps<
    Omit<TreeRootProps<T, U, M>, 'modelValue' | 'expanded'> & {
      class?: HTMLAttributes['class']
      /** 接口获取方式 */
      api?: () => Promise<T[]>
      watch?: unknown
      /** 是否虚拟化列表 */
      virtual?: boolean | TreeVirtualizerProps
      /** 获取名称 */
      getName: (val: T) => string
      /** 获取二级名称 */
      getSubName?: (val: T) => string
      /** 获取名称 */
      getIcon?: (val: FlattenedItem<T>) => string | undefined
      /** 获取徽标 */
      getBadge?: (val: T) => string | number | BadgeProps
      /** 是否扁平化列表 */
      flatten?: boolean
      /** 是否全部展开 */
      expandAll?: boolean
      /** 是否加载中 */
      loading?: boolean
    }
  >(),
  { virtual: false, flatten: false, expandAll: false },
)
const emits = defineEmits<{
  change: [v: M extends true ? U[] : U]
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const queryId = useId()
const { data, status, refetch } = useQuery<T[]>({
  queryKey: ['ui-tree', queryId],
  queryFn: () => (props.api ? props.api() : Promise.resolve([])),
  staleTime: 0,
  gcTime: 0,
  refetchOnMount: 'always',
})
watch(
  () => props.watch,
  () => void refetch(),
  { deep: true },
)
const items = computed(() => {
  if (props.api) return data.value || []
  return props.items || []
})
const virtualizerProps = computed<TreeVirtualizerProps>(() => {
  if (!props.virtual) return {}
  const defaultProps: TreeVirtualizerProps = {
    estimateSize: 40,
    textContent: props.getName as (item: Record<string, unknown>) => string,
  }
  if (typeof props.virtual === 'object') {
    return { ...defaultProps, ...props.virtual }
  }
  return defaultProps
})
/** 获取子级 */
function getChildren(item: T): T[] | undefined {
  return props.getChildren?.(item) ?? (item.children as T[] | undefined)
}
/** 获取所有可展开节点的 key */
function getAllExpandedKeys(list: T[]) {
  const keys: string[] = []
  for (const item of list) {
    const children = getChildren(item)
    if (!children?.length) continue

    keys.push(props.getKey(item))
    keys.push(...getAllExpandedKeys(children))
  }
  return keys
}
/** 同步展开状态 */
function syncExpandedKeys() {
  if (props.expandAll) expanded.value = getAllExpandedKeys(items.value)
}
watch([items, () => props.expandAll], syncExpandedKeys, {
  immediate: true,
  deep: true,
})
/** 选择事件 */
function select(e: ListboxItemSelectEvent<T>) {
  if (
    ['click', 'keydown'].includes(e.detail.originalEvent.type) &&
    isEqual(e.detail.value, modelValue.value) &&
    !props.multiple
  )
    e.preventDefault()
}
/** 切换事件 */
function toggle(e: TreeItemToggleEvent<T>) {
  e.preventDefault()
}

defineExpose({ refresh: refetch })
</script>

<template>
  <UiTreeRoot
    v-slot="{ flattenItems }"
    v-bind="omit(props, ['class', 'items'])"
    v-model="modelValue"
    v-model:expanded="expanded"
    :class="props.class"
    :items="items"
    @update:model-value="emits('change', cloneDeep($event) as M extends true ? U[] : U)"
  >
    <div v-if="status === 'pending' || props.loading" class="text-center">
      <UiSpinner class="inline" />
    </div>
    <!-- 虚拟化 -->
    <UiTreeVirtualizer v-else-if="props.virtual" v-slot="{ item }" v-bind="virtualizerProps">
      <UiTreeItem
        v-bind="item.bind"
        :flatten="props.flatten"
        :icon="props.getIcon?.(item as FlattenedItem<T>)"
        :label="props.getName(item.value as T)"
        :sub-label="props.getSubName?.(item.value as T)"
        :badge="props.getBadge?.(item.value as T)"
        :has-children="item.hasChildren"
        @select="select"
        @toggle="toggle"
      >
        <template v-if="$slots.action" #action="slots">
          <slot name="action" v-bind="{ ...slots, item: item.value as T }" />
        </template>
      </UiTreeItem>
    </UiTreeVirtualizer>

    <!-- 非虚拟化 -->
    <template v-else>
      <UiTreeItem
        v-for="item in flattenItems"
        :key="item._id"
        v-bind="item.bind"
        :flatten="props.flatten"
        :icon="props.getIcon?.(item)"
        :label="props.getName(item.value)"
        :sub-label="props.getSubName?.(item.value)"
        :badge="props.getBadge?.(item.value)"
        :has-children="item.hasChildren"
        @select="select"
        @toggle="toggle"
      >
        <template v-if="$slots.action" #action="slots">
          <slot name="action" v-bind="{ ...slots, item: item.value }" />
        </template>
      </UiTreeItem>
    </template>
  </UiTreeRoot>
</template>
