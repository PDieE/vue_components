<script setup lang="ts" generic="TData, TValue">
import type { Cell, Row, Table } from '@tanstack/vue-table'
import { FlexRender } from '@tanstack/vue-table'
import { useElementSize } from '@vueuse/core'
import type { HTMLAttributes } from 'vue'
import { shallowRef, useTemplateRef, watchEffect, computed } from 'vue'

import { cn } from '@/lib/utils'

const {
  table,
  row,
  cell,
  class: className,
} = defineProps<{
  /** 表格 */
  table: Table<TData>
  /** 行 */
  row: Row<TData>
  /** 单元格 */
  cell: Cell<TData, TValue>
  /** 文本容器类名。 */
  class?: HTMLAttributes['class']
}>()

/**
 * ====================
 *    表格实例/渲染辅助
 * ====================
 */
const elRef = useTemplateRef('elRef')
const { width, height } = useElementSize(elRef)
const isOverflowX = shallowRef(false)
const isOverflowY = shallowRef(false)
watchEffect(() => {
  const el = elRef.value
  if (!el) return

  isOverflowX.value = el.scrollWidth > width.value
  isOverflowY.value = el.scrollHeight > height.value
})

const overflow = computed(() => isOverflowX.value || isOverflowY.value)
</script>

<template>
  <UiTooltipApp :disabled="!overflow">
    <template #trigger>
      <div ref="elRef" :class="cn('min-w-0 truncate', className)">
        <slot
          :cell="cell"
          :column="cell.column"
          :row="row"
          :record="row.original"
          :value="cell.getValue()"
          :table="table"
        >
          <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
        </slot>
      </div>
    </template>

    <slot
      name="tooltip"
      :cell="cell"
      :column="cell.column"
      :row="row"
      :record="row.original"
      :value="cell.getValue()"
      :table="table"
    >
      <slot
        :cell="cell"
        :column="cell.column"
        :row="row"
        :record="row.original"
        :value="cell.getValue()"
        :table="table"
      >
        <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
      </slot>
    </slot>
  </UiTooltipApp>
</template>
