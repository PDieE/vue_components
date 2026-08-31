<script setup lang="ts" generic="TData extends object = ComboboxOptionCascader, TParams = void">
import { Icon } from '@iconify/vue'
import { useQuery } from '@tanstack/vue-query'
import { cloneDeep } from 'es-toolkit'
import type { HTMLAttributes } from 'vue'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { ComboboxOptionCascader, ComboboxValue } from '.'

const modelValue = defineModel<ComboboxValue | undefined>()
const {
  options = [],
  api,
  params,
  keys,
  placeholder = '请选择',
  clearable = true,
  checkStrictly = false,
  readonly = false,
  ...props
} = defineProps<{
  class?: HTMLAttributes['class']
  /** 选项 */
  options?: TData[]
  /** 数据获取方法 */
  api?: (params: TParams) => Promise<TData[]>
  params?: TParams
  /** 字段别名 */
  keys?: { type?: string; value?: string; label?: string; disabled?: string; children?: string }
  /** 占位符 */
  placeholder?: string
  /** 是否可清空 */
  clearable?: boolean
  /** 可各自选中或取消 */
  checkStrictly?: boolean
  /** 是否只读，只读时不可打开或修改选择 */
  readonly?: boolean
}>()
watch(
  () => readonly,
  (isReadonly) => {
    if (isReadonly) open.value = false
  },
)
const emits = defineEmits<{
  /** 选择选项时触发 */
  change: [value: ComboboxValue | undefined, option: TData | undefined, path: TData[]]
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
/** 下拉面板是否打开 */
const open = shallowRef(false)
/** 规范化后的选项列表，统一字段名后供组件内部使用 */
const innerOptions = ref<ComboboxOptionCascader[]>([])
/** 当前展开路径，只保存带有 children 的节点，用于生成右侧子级列 */
const expandedPath = ref<ComboboxOptionCascader[]>([])
/** 当前选中的选项 */
const selected = computed(() => findOption(innerOptions.value, modelValue.value))
/** 当前选中项的完整路径，用于回显“父级 / 子级 / 孙级” */
const selectedPath = computed(() =>
  findOptionPath(innerOptions.value, modelValue.value, selected.value),
)
/** 多列数据：第一列为根选项，后续列来自 expandedPath 中每个节点的 children */
const columns = computed(() => {
  if (!innerOptions.value.length) return []

  const visibleColumns: ComboboxOptionCascader[][] = [innerOptions.value]

  for (const option of expandedPath.value) {
    if (!option.children?.length) break
    visibleColumns.push(option.children)
  }

  return visibleColumns
})
const queryId = useId()
const { data, status } = useQuery<TData[]>({
  queryKey: computed(() => ['ui-combobox-cascader', queryId, params]),
  queryFn: () => (api ? api(params as TParams) : Promise.resolve([])),
  staleTime: 0,
  gcTime: 0,
  refetchOnMount: 'always',
})
/** 外部接口字段名映射 */
const normalizedKeys = computed(() => ({
  type: keys?.type || 'type',
  value: keys?.value || 'value',
  label: keys?.label || 'label',
  disabled: keys?.disabled || 'disabled',
  children: keys?.children || 'children',
}))
watchEffect(() => {
  if (!api) {
    innerOptions.value = normalizeOptions(cloneDeep(options))
    return
  }

  innerOptions.value = normalizeOptions(data.value || [])
})

/**
 * 将接口返回的数据递归转换为组件内部统一结构
 * @param list 原始选项列表
 */
function normalizeOptions(list: TData[]): ComboboxOptionCascader[] {
  const { type, value, label, disabled, children } = normalizedKeys.value

  return list.map((item) => {
    const source = item as Record<string, unknown>
    const childOptions = Array.isArray(source[children])
      ? normalizeOptions(source[children] as TData[])
      : undefined

    return {
      ...source,
      type: source[type] as ComboboxOptionCascader['type'],
      value: source[value] as ComboboxOptionCascader['value'],
      label: source[label] as ComboboxOptionCascader['label'],
      disabled: source[disabled] as ComboboxOptionCascader['disabled'],
      children: childOptions,
    }
  })
}

/**
 * 根据 value 在级联树中递归查找选项
 * @param list 选项列表
 * @param value 目标值
 */
function findOption(
  list: ComboboxOptionCascader[],
  value: ComboboxValue | undefined,
): ComboboxOptionCascader | undefined {
  for (const option of list) {
    if (option.value === value) return option

    const childOption = option.children?.length ? findOption(option.children, value) : undefined
    if (childOption) return childOption
  }
}

/**
 * 根据 value 在级联树中查找完整路径
 * @param list 选项列表
 * @param value 目标值
 * @param selectedOption 已知的选中项，避免重复查找
 */
function findOptionPath(
  list: ComboboxOptionCascader[],
  value: ComboboxValue | undefined,
  selectedOption: ComboboxOptionCascader | undefined,
): ComboboxOptionCascader[] {
  const targetValue = selectedOption?.value ?? value

  if (targetValue === undefined) return []

  for (const option of list) {
    if (option.value === targetValue) return [option]

    const childPath = option.children?.length
      ? findOptionPath(option.children, targetValue, undefined)
      : []
    if (childPath.length) return [option, ...childPath]
  }

  return []
}

/**
 * 选择选项
 * 非严格模式下，带有子级的节点只负责展开，不会被选中。
 * @param opt 选择的选项
 */
async function select(opt: ComboboxOptionCascader | undefined) {
  if (readonly) return

  if (opt?.children?.length && !checkStrictly) return
  modelValue.value = opt?.value
  open.value = false
  await nextTick()
  emits(
    'change',
    cloneDeep(modelValue.value),
    cloneDeep(selected.value) as TData,
    cloneDeep(selectedPath.value) as TData[],
  )
}

/**
 * 展开某一级选项，并将它的子级显示在右侧列
 * @param option 当前悬停或选中的选项
 * @param level 当前选项所在列索引
 */
function expand(option: ComboboxOptionCascader, level: number) {
  if (!option.children?.length) {
    expandedPath.value = expandedPath.value.slice(0, level)
    return
  }

  expandedPath.value = [...expandedPath.value.slice(0, level), option]
}

/**
 * CommandItem 选择事件处理：先展开子级，再按配置尝试选中当前项
 * @param option 当前选项
 * @param level 当前选项所在列索引
 */
function handleSelect(option: ComboboxOptionCascader, level: number) {
  if (readonly) return

  expand(option, level)
  select(option)
}

/**
 * 判断选项是否处于当前展开路径中
 * @param option 选项
 */
function isExpanded(option: ComboboxOptionCascader) {
  return expandedPath.value.some((v) => v.value === option.value)
}

/**
 * 判断选项是否处于当前选中路径中
 * @param option 选项
 */
function isInSelectedPath(option: ComboboxOptionCascader) {
  return selectedPath.value.some((v) => v.value === option.value)
}

/**
 * 生成选项渲染 key，兼容 separator 和 value 为空的场景
 * @param option 选项
 * @param level 所在列索引
 * @param index 所在列内索引
 */
function getOptionKey(option: ComboboxOptionCascader, level: number, index: number) {
  return `${level}-${option.type || 'option'}-${String(option.value ?? option.label ?? index)}`
}

/**
 * 生成列渲染 key，父级变化时强制刷新对应列
 * @param list 当前列选项列表
 * @param level 当前列索引
 */
function getColumnKey(list: ComboboxOptionCascader[], level: number) {
  const parent = expandedPath.value[level - 1]

  return `${level}-${String(parent?.value ?? parent?.label ?? 'root')}-${list.length}`
}

/** 打开面板时默认展开到当前选中项的父级路径，选中项本身不自动展开 */
watch(open, (isOpen) => {
  if (isOpen) {
    expandedPath.value = selectedPath.value.slice(0, -1).filter((option) => option.children?.length)
  }
})
</script>

<template>
  <UiPopover
    :open="open"
    @update:open="(nextOpen) => (!readonly || !nextOpen ? (open = nextOpen) : undefined)"
  >
    <UiPopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="relative"
        :class="
          cn(
            'group',
            readonly && 'cursor-default',
            'disabled:bg-disabled disabled:border-input disabled:opacity-100 disabled:text-foreground-3',
            open && 'border-brand',
            props.class,
          )
        "
        :loading="status === 'pending'"
      >
        <span class="flex-1 text-left truncate">
          {{ selectedPath.map((v) => v.label).join(' / ') || selected?.label || placeholder }}
        </span>
        <Icon
          class="text-foreground-2"
          :class="!readonly && clearable && selected && 'transition-all group-hover:opacity-0'"
          icon="icon-park-outline:down"
        />
        <span
          v-if="!readonly && clearable && selected"
          class="z-10 text-foreground-2 absolute right-2.5 transition-all opacity-0 group-hover:opacity-100 hover:text-foreground-4"
          @click.stop="select(undefined)"
        >
          <Icon icon="icon-park-solid:close-one" />
        </span>
      </Button>
    </UiPopoverTrigger>
    <UiPopoverContent class="z-1000 w-auto p-0" align="start">
      <UiCommand class="rounded-md">
        <UiCommandList class="max-h-72 overflow-x-auto overflow-y-hidden [&>div]:flex">
          <div
            v-if="columns.length === 0"
            class="w-(--reka-popover-trigger-width) py-6 text-center text-sm"
          >
            暂无数据
          </div>
          <UiCommandGroup
            v-for="(column, level) in columns"
            :key="getColumnKey(column, level)"
            class="min-w-28 max-h-72 overflow-y-auto border-r last:border-r-0"
          >
            <template v-for="(option, index) in column" :key="getOptionKey(option, level, index)">
              <UiCommandSeparator v-if="option.type === 'separator'" />
              <UiCommandItem
                v-else-if="option.value !== undefined"
                class="hover:bg-hover"
                :class="[
                  (modelValue === option.value || isExpanded(option) || isInSelectedPath(option)) &&
                    'bg-brand-bg-hover! hover:bg-brand-bg-hover!',
                ]"
                :disabled="option.disabled"
                :value="`${level}-${String(option.value)}`"
                @mouseenter="expand(option, level)"
                @select="handleSelect(option, level)"
              >
                <span class="min-w-0 flex-1 truncate">{{ option.label }}</span>
                <Icon
                  v-if="option.children?.length"
                  class="ml-auto shrink-0 text-foreground-2"
                  icon="icon-park-outline:right"
                />
              </UiCommandItem>
            </template>
          </UiCommandGroup>
        </UiCommandList>
      </UiCommand>
    </UiPopoverContent>
  </UiPopover>
</template>
