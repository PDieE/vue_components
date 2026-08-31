<script setup lang="ts">
import type { ComponentPublicInstance, HTMLAttributes } from 'vue'
import { computed, nextTick, onBeforeUnmount, shallowRef, watch } from 'vue'

import { cn } from '@/lib/utils'

import type { WheelPickerOption, WheelPickerValue } from '.'

const modelValue = defineModel<WheelPickerValue>()
const ITEM_HEIGHT = 28

const props = withDefaults(
  defineProps<{
    /** 选项 */
    options?: WheelPickerOption[]
    /** 选中项上方/下方最多显示的选项数量 */
    visibleOptionCount?: number
    /** 是否禁用 */
    disabled?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    options: () => [],
    visibleOptionCount: 3,
    disabled: false,
  },
)

const emits = defineEmits<{
  /** 值改变时触发 */
  change: [v?: WheelPickerValue]
}>()

const scrollRef = shallowRef<HTMLElement>()
const scrollTimer = shallowRef<ReturnType<typeof setTimeout>>()
const syncingScroll = shallowRef(false)

const visibleCount = computed(() => Math.max(0, Math.floor(props.visibleOptionCount)))
const pickerHeight = computed(() => (visibleCount.value * 2 + 1) * ITEM_HEIGHT)
const optionOffset = computed(() => visibleCount.value * ITEM_HEIGHT)

function setScrollRef(el: Element | ComponentPublicInstance | null) {
  if (!el || !('$el' in el || el instanceof HTMLElement)) return
  scrollRef.value = (el instanceof HTMLElement ? el : el.$el) as HTMLElement
}

function getSelectedIndex() {
  const index = props.options.findIndex((option) => option.value === modelValue.value)
  return index === -1 ? 0 : index
}

function scrollToIndex(index: number, behavior: ScrollBehavior = 'auto') {
  const el = scrollRef.value
  if (!el) return
  syncingScroll.value = true
  el.scrollTo({
    top: index * ITEM_HEIGHT,
    behavior,
  })
  setTimeout(() => {
    syncingScroll.value = false
  }, 50)
}

function syncScrollPosition(behavior: ScrollBehavior = 'auto') {
  nextTick(() => {
    scrollToIndex(getSelectedIndex(), behavior)
  })
}

function updateModelValue(option?: WheelPickerOption) {
  if (!option || option.disabled || props.disabled) return
  if (modelValue.value === option.value) return

  modelValue.value = option.value
  emits('change', option.value)
}
/**
 * 获取最近的未禁用选项的索引
 * @param index 目标索引
 */
function getNearestEnabledIndex(index: number) {
  const safeIndex = Math.min(Math.max(index, 0), props.options.length - 1)
  if (!props.options[safeIndex]?.disabled) return safeIndex

  for (let offset = 1; offset < props.options.length; offset += 1) {
    const previousIndex = safeIndex - offset
    if (previousIndex >= 0 && !props.options[previousIndex]?.disabled) return previousIndex

    const nextIndex = safeIndex + offset
    if (nextIndex < props.options.length && !props.options[nextIndex]?.disabled) return nextIndex
  }
}
/**
 * 选择索引对应的选项
 * @param index 目标索引
 * @param behavior 滚动行为
 */
function selectByIndex(index: number, behavior: ScrollBehavior = 'auto') {
  if (!props.options.length) return

  const enabledIndex = getNearestEnabledIndex(index)
  if (enabledIndex === undefined) return syncScrollPosition(behavior)

  updateModelValue(props.options[enabledIndex])
  scrollToIndex(enabledIndex, behavior)
}

function handleScroll(event: Event) {
  if (props.disabled || syncingScroll.value) return

  const el = event.currentTarget as HTMLElement
  if (scrollTimer.value) clearTimeout(scrollTimer.value)

  scrollTimer.value = setTimeout(() => {
    const index = Math.round(el.scrollTop / ITEM_HEIGHT)
    selectByIndex(index, 'auto')
    scrollTimer.value = undefined
  }, 180)
}

watch(
  [() => props.options, modelValue],
  () => {
    syncScrollPosition()
  },
  { immediate: true, deep: true },
)

onBeforeUnmount(() => {
  if (scrollTimer.value) clearTimeout(scrollTimer.value)
})
</script>

<template>
  <div
    data-slot="wheel-picker"
    :class="
      cn(
        'inline-flex select-none gap-1 text-sm text-foreground-3',
        disabled && 'pointer-events-none opacity-50',
        props.class,
      )
    "
  >
    <div
      data-slot="wheel-picker-column"
      class="relative min-w-16 overflow-hidden"
      :style="{ height: `${pickerHeight}px` }"
    >
      <div
        class="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-[28px] -translate-y-1/2 rounded bg-brand-bg"
      ></div>
      <div
        class="pointer-events-none absolute inset-x-0 top-0 z-30 h-14 bg-gradient-to-b from-background via-background/85 to-transparent"
      ></div>
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-14 bg-gradient-to-t from-background via-background/85 to-transparent"
      ></div>

      <div
        :ref="setScrollRef"
        class="wheel-picker-scroll relative z-20 h-full overflow-y-auto overscroll-contain"
        role="listbox"
        :aria-disabled="disabled"
        :style="{
          paddingTop: `${optionOffset}px`,
          paddingBottom: `${optionOffset}px`,
        }"
        @scroll="handleScroll"
      >
        <button
          v-for="(option, optionIndex) in options"
          :key="`${option.value}-${optionIndex}`"
          type="button"
          role="option"
          :aria-selected="modelValue === option.value"
          :disabled="disabled || option.disabled"
          :class="
            cn(
              'flex w-full items-center justify-center rounded px-3 font-normal transition-colors outline-none',
              'hover:bg-layout hover:text-foreground-4 focus-visible:ring-2 focus-visible:ring-brand/20',
              'disabled:cursor-not-allowed disabled:opacity-40',
              modelValue === option.value ? 'text-brand' : 'text-foreground-3',
            )
          "
          :style="{ height: `${ITEM_HEIGHT}px` }"
          @click="selectByIndex(optionIndex)"
        >
          <span class="truncate">{{ option.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wheel-picker-scroll {
  scrollbar-width: none;
}

.wheel-picker-scroll::-webkit-scrollbar {
  display: none;
}
</style>
