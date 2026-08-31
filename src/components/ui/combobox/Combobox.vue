<script setup lang="ts" generic="TData extends object">
import { Icon } from '@iconify/vue'
import { useQuery } from '@tanstack/vue-query'
import { cloneDeep } from 'es-toolkit'
import type { HTMLAttributes } from 'vue'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import UiTag from '@/components/ui/tag/Tag.vue'
import { cn } from '@/lib/utils'

import type { ComboboxChangeOption, ComboboxModelValue, ComboboxOption, ComboboxValue } from '.'

const modelValue = defineModel<ComboboxModelValue>()
const {
  options = [],
  api,
  params,
  keys,
  placeholder = '请选择',
  clearable = true,
  filter = false,
  filterPlaceholder = '搜索',
  disabled = false,
  readonly = false,
  loading = false,
  multiple = false,
  ...props
} = defineProps<{
  class?: HTMLAttributes['class']
  /** 选项 */
  options?: (ComboboxOption | TData)[]
  /** 数据获取方法 */
  api?: (params?: unknown) => Promise<TData[]>
  params?: unknown
  /** 字段别名 */
  keys?: { type?: string; value?: string; label?: string; disabled?: string }
  /** 占位符 */
  placeholder?: string
  /** 是否可清空 */
  clearable?: boolean
  /** 是否开启筛选 */
  filter?: boolean
  /** 筛选占位符 */
  filterPlaceholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读，只读时不可打开或修改选择 */
  readonly?: boolean
  /** 外部加载状态 */
  loading?: boolean
  /** 是否多选 */
  multiple?: boolean
}>()
watch(
  () => readonly,
  (isReadonly) => {
    if (isReadonly) open.value = false
  },
)
const emits = defineEmits<{
  /** 选择选项时触发 */
  change: [value: ComboboxModelValue, option: ComboboxChangeOption]
}>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const open = shallowRef(false)
const innerOptions = computed(() => {
  const { type = 'type', value = 'value', label = 'label', disabled = 'disabled' } = keys || {}
  if (!api) {
    return cloneDeep(options || []).map((v) => {
      const item = v as Record<string, unknown>
      return {
        ...item,
        type: item[type] as ComboboxOption['type'],
        value: item[value] as ComboboxValue,
        label: item[label] as string,
        disabled: item[disabled] as boolean,
      }
    })
  }
  return cloneDeep(data.value || []).map((v) => {
    const item = v as Record<string, unknown>
    return {
      ...item,
      type: item[type] as ComboboxOption['type'],
      value: item[value] as ComboboxValue,
      label: item[label] as string,
      disabled: item[disabled] as boolean,
    }
  })
})
const selectedValueList = computed<ComboboxValue[]>(() => {
  if (!Array.isArray(modelValue.value)) return []
  return modelValue.value
})
const selected = computed(() => innerOptions.value.find((o) => o.value === modelValue.value))
const selectedOptions = computed(() =>
  innerOptions.value.filter((o) => selectedValueList.value.includes(o.value as ComboboxValue)),
)
const queryId = useId()
const { data, status } = useQuery<TData[]>({
  queryKey: computed(() => ['ui-combobox', queryId, params]),
  queryFn: () => (api ? api(params) : Promise.resolve([])),
  staleTime: 0,
  gcTime: 0,
  refetchOnMount: 'always',
})

/**
 * 选择选项
 * @param selectedValue 选择的值
 */
async function select(selectedValue: ComboboxValue | undefined) {
  if (readonly) return

  // 多选模式
  if (multiple) {
    if (selectedValue === undefined) return
    const nextValue = selectedValueList.value.includes(selectedValue)
      ? selectedValueList.value.filter((v) => v !== selectedValue)
      : [...selectedValueList.value, selectedValue]

    modelValue.value = nextValue
    await nextTick()
    emits('change', nextValue, cloneDeep(selectedOptions.value))
    return
  }

  // 单选模式
  modelValue.value = selectedValue
  open.value = false
  await nextTick()
  emits('change', selectedValue, cloneDeep(selected.value))
}
/** 清空选择的选项 */
async function clearSelected() {
  if (readonly) return

  const nextValue = multiple ? [] : undefined
  modelValue.value = nextValue
  open.value = false
  await nextTick()
  emits('change', nextValue, multiple ? [] : undefined)
}
/**
 * 是否选择了该选项
 * @param value 选项值
 */
function isOptionSelected(value: ComboboxValue) {
  return multiple ? selectedValueList.value.includes(value) : modelValue.value === value
}
</script>

<template>
  <Popover
    :open="open"
    @update:open="(nextOpen) => (!readonly || !nextOpen ? (open = nextOpen) : undefined)"
  >
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="relative"
        :class="
          cn(
            'group transition-none',
            readonly && 'cursor-default',
            multiple && selectedOptions.length && 'h-auto min-h-8 py-1',
            'disabled:bg-disabled disabled:border-input disabled:opacity-100 disabled:text-foreground-3',
            open && 'border-brand',
            props.class,
          )
        "
        :loading="loading || status === 'pending'"
        :disabled="disabled || loading"
      >
        <span
          v-if="multiple && selectedOptions.length"
          class="flex flex-1 flex-wrap gap-1 text-left"
        >
          <UiTag
            v-for="option in selectedOptions"
            :key="option.value?.toString()"
            class="max-w-full"
          >
            <span class="max-w-28 truncate">{{ option.label }}</span>
            <span
              v-if="!disabled && !readonly"
              class="ml-1 inline-flex text-foreground-2 hover:text-foreground-4"
              @click.stop="select(option.value)"
            >
              <Icon icon="icon-park-solid:close-one" class="size-3" />
            </span>
          </UiTag>
        </span>
        <span v-else class="flex-1 truncate text-left">{{ selected?.label || placeholder }}</span>
        <Icon
          class="text-foreground-2"
          :class="
            !readonly &&
            clearable &&
            (selected || selectedOptions.length) &&
            'transition-all group-hover:opacity-0'
          "
          icon="icon-park-outline:down"
        />
        <span
          v-if="!readonly && clearable && (selected || selectedOptions.length)"
          class="z-10 text-foreground-2 absolute right-2.5 transition-all opacity-0 group-hover:opacity-100 hover:text-foreground-4"
          @click.stop="clearSelected"
        >
          <Icon icon="icon-park-solid:close-one" />
        </span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-(--reka-popover-trigger-width) p-0 z-1000">
      <Command>
        <CommandInput v-if="filter" class="h-9" :placeholder="filterPlaceholder" />
        <CommandList>
          <div v-if="innerOptions.length === 0" class="py-6 text-center text-sm">暂无数据</div>
          <CommandEmpty v-else>无结果</CommandEmpty>
          <CommandGroup class="space-y-0.5">
            <template v-for="option in innerOptions" :key="option.value">
              <CommandSeparator v-if="option.type === 'separator'" />
              <CommandItem
                v-else-if="option.value !== undefined"
                :disabled="option.disabled"
                :class="[
                  'data-highlighted:bg-transparent data-highlighted:hover:bg-hover',
                  !isOptionSelected(option.value) && 'hover:bg-hover',
                  isOptionSelected(option.value) && 'bg-brand-bg-hover! hover:bg-brand-bg-hover!',
                ]"
                :value="option.value"
                @select="
                  () => {
                    select(option.value)
                  }
                "
              >
                <span class="flex-1 truncate">{{ option.label }}</span>
                <Icon
                  v-if="multiple"
                  class="ml-auto text-brand"
                  :class="isOptionSelected(option.value) ? 'opacity-100' : 'opacity-0'"
                  icon="icon-park-outline:check"
                />
              </CommandItem>
            </template>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
