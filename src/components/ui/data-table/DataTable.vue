<script setup lang="ts" generic="TData, TValue">
import { MinusIcon, PlusIcon } from '@lucide/vue'
import type { ColumnDef, ExpandedState, Row, RowSelectionState, Updater } from '@tanstack/vue-table'
import { FlexRender, getCoreRowModel, getExpandedRowModel, useVueTable } from '@tanstack/vue-table'
import type { VirtualItem } from '@tanstack/vue-virtual'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { useEventListener } from '@vueuse/core'
import type { ComponentPublicInstance, HTMLAttributes } from 'vue'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'

import { valueUpdater } from '@/components/ui/table/utils'
import { cn } from '@/lib/utils'

import type { DataTableColumn, DataTableColumnMeta, DataTableColumnMetaSelectOptions } from '.'
import { getAccessorKey, getCellEllipsisSlotName, getCellContent, getCellSlotName } from '.'
import DataTableEllipsis from './DataTableEllipsis.vue'

const ROW_SELECT_ACCESSOR_KEY = 'row-select'

/**
 * 表格行唯一键配置。
 * - 传字符串时，从行数据中读取对应字段。
 * - 传函数时，可自行组合行数据和索引生成唯一键。
 */
type RowKey<TData> = keyof TData | ((row: TData, index: number) => string | number)
type DataTableTreeOptions<TData> = {
  /** 树形结构子节点字段, 默认 children */
  childrenKey: keyof TData | string
  /** 是否默认展开全部，仅默认情况有效。如果希望自由控制树形结构的展开或收起，可使用实例方法 expandAll 和 foldAll，默认 false */
  defaultExpandAll: boolean
  /** 是否在点击行时展开树形结构节点 */
  expandTreeNodeOnClick: boolean
  /** 树结点缩进距离，单位：px，默认 24 */
  indent: number
  /** 树结点在第几列渲染，默认为第一列,默认0 */
  treeNodeColumnIndex: number
}

const props = withDefaults(
  defineProps<{
    /** TanStack Table 列定义，用于描述每一列的字段、标题、宽度和渲染方式。 */
    columns: DataTableColumn<TData, TValue>[]
    /** 表格数据源，每一项对应一行原始数据。 */
    data: TData[]
    /** 行唯一键，默认优先读取数据项的 id 字段，缺失时回退到行索引。 */
    rowKey?: RowKey<TData>
    /** 空数据时显示的文案。 */
    emptyText?: string
    /** 是否显示加载中遮罩。 */
    loading?: boolean
    /** 外层容器类名。 */
    class?: HTMLAttributes['class']
    /** 透传给 UiTable 的类名。 */
    tableClass?: HTMLAttributes['class']
    /** 是否启用纵向行虚拟滚动。横向仍使用 UiScrollArea 普通滚动。 */
    virtualScroll?: boolean
    /** 树配置 */
    tree?: Partial<DataTableTreeOptions<TData>>
  }>(),
  { emptyText: '暂无数据', loading: false, virtualScroll: false },
)

/**
 * ====================
 *    表格实例/渲染辅助
 * ====================
 */
/** 最终传给 TanStack Table 的列定义，包含按固定位置归位的业务列和外部声明的选择列。 */
const tableColumns = computed<ColumnDef<TData, TValue>[]>(() => {
  const columns = props.columns.map((column) =>
    isRowSelectionColumn(column) ? createSelectionColumn(column) : column,
  )
  const leftFixedColumns = columns.filter((column) => getMeta(column)?.fixed === 'left')
  const rightFixedColumns = columns.filter((column) => getMeta(column)?.fixed === 'right')
  const normalColumns = columns.filter((column) => !getMeta(column)?.fixed)

  return [leftFixedColumns, normalColumns, rightFixedColumns].flat()
})
const rowSelectOpts = computed<Required<DataTableColumnMetaSelectOptions<TData>>>(() => {
  const selectionColumn = tableColumns.value.find(isRowSelectionColumn)
  const selectOptions = getMeta(selectionColumn)?.selectOptions

  // 统一选择列默认值，后续逻辑只读取 Required 配置，避免每处重复判空。
  return {
    type: selectOptions?.type ?? 'multiple',
    disabled: selectOptions?.disabled ?? (() => false),
    reserveSelectedRowOnPaginate: selectOptions?.reserveSelectedRowOnPaginate ?? true,
  }
})
/** 是否启用树形能力；未传 tree 时仍按普通表格渲染。 */
const treeEnabled = computed(() => Boolean(props.tree))
/**
 * TanStack Table 实例。
 * 当前启用 core row model、row selection、固定列和基于 meta.visible 的初始显隐。
 */
const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return tableColumns.value
  },
  getRowId: (row, index, parent) => getRowKey(row, index, parent),
  getSubRows,
  getExpandedRowModel: getExpandedRowModel(),
  get enableExpanding() {
    return treeEnabled.value
  },
  autoResetExpanded: false,
  enableRowSelection: (row) => !rowSelectOpts.value.disabled(row),
  get enableMultiRowSelection() {
    return rowSelectOpts.value.type !== 'single'
  },
  getCoreRowModel: getCoreRowModel(),
  onRowSelectionChange: updateRowSelection,
  state: {
    get rowSelection() {
      return rowSelection.value
    },
    get expanded() {
      return expanded.value
    },
    /**
     * TanStack columnVisibility 采用 { [columnId]: boolean }：
     * - 未出现在对象里的列默认可见，因此这里只收集 visible === false 的列。
     * - 这样 meta.visible 不配置或配置为 true 时，都不会产生额外状态。
     */
    get columnVisibility() {
      return tableColumns.value.reduce<Record<string, boolean>>((visibility, column) => {
        const columnId = getColumnId(column)

        if (columnId && getMeta(column)?.visible === false) {
          visibility[columnId] = false
        }

        return visibility
      }, {})
    },
    get columnPinning() {
      return {
        left: props.columns
          .filter((v) => getMeta(v)?.fixed === 'left')
          .map((v) => getAccessorKey(v))
          .filter(isString),
        right: props.columns
          .filter((v) => getMeta(v)?.fixed === 'right')
          .map((v) => getAccessorKey(v))
          .filter(isString),
      }
    },
  },
  onExpandedChange: updateExpanded,
})

/** 当前可见叶子列，用于渲染 colgroup、表头和单元格。 */
const visibleColumns = computed(() => table.getVisibleLeafColumns())
const tableRows = computed(() => table.getRowModel().rows)

type VisibleColumn = (typeof visibleColumns.value)[number]
type RenderedTableRow = {
  row: Row<TData>
  virtualItem?: VirtualItem
}

/** 获取固定列样式。 */
function getFixedColumnStyle(column: VisibleColumn) {
  const isPinned = column.getIsPinned()

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    width: `${column.getSize()}px`,
  }
}

/**
 * 获取表头插槽名称。
 * header 为字符串时使用标题本身，否则回退到列 id。
 */
function getHeaderSlotName(
  header: ReturnType<typeof table.getHeaderGroups>[number]['headers'][number],
) {
  const columnHeader = header.column.columnDef.header

  if (typeof columnHeader === 'string') {
    return columnHeader
  }

  return header.column.id
}

/**
 * ====================
 *       行选中
 * ====================
 */
/** 通过 v-model:selected 双向绑定的选中行原始数据。 */
const selectedRows = defineModel<TData[]>('selected', { default: () => [] })
/** TanStack Table 内部使用的行选中状态，key 为 row id，value 为是否选中。 */
const rowSelection = ref<RowSelectionState>({})

function isRowSelectionColumn(columnDef: ColumnDef<TData, TValue>) {
  return getAccessorKey(columnDef) === ROW_SELECT_ACCESSOR_KEY
}

/**
 * 内置行选择列。
 * 外部通过 accessorKey: 'row-select' 声明位置，组件内部接管全选和单行选择逻辑。
 */
function createSelectionColumn(columnDef: ColumnDef<TData, TValue>): ColumnDef<TData, TValue> {
  return {
    ...columnDef,
    id: ROW_SELECT_ACCESSOR_KEY,
    size: columnDef.size ?? 48,
    enableSorting: false,
    enableHiding: false,
  }
}
const allRowsSelected = computed(() => {
  const selectableRows = currentSelectableRows.value

  if (selectableRows.length === 0) return false
  if (selectableRows.every((row) => row.getIsSelected())) return true
  if (selectableRows.some((row) => row.getIsSelected())) return 'indeterminate'
  return false
})
/** 当前 data 中允许被选择的行，用于全选状态和批量切换。 */
const currentSelectableRows = computed(() =>
  table.getPreSelectedRowModel().flatRows.filter((row) => row.getCanSelect()),
)

/**
 * 获取表格行唯一键。
 * 该键同时用于 TanStack 的 row id 和选中状态映射。
 */
function getRowKey(row: TData, index: number, parent?: Row<TData>) {
  if (typeof props.rowKey === 'function') {
    return String(props.rowKey(row, index))
  }

  if (props.rowKey) {
    return String(row[props.rowKey])
  }

  const maybeId = (row as Record<string, unknown>).id
  if (maybeId != null) {
    return String(maybeId)
  }

  return parent ? `${parent.id}.${index}` : String(index)
}

/**
 * 根据 TanStack 的选中状态，反查当前数据源中的原始行数据。
 * reserveSelectedRowOnPaginate 为 true 时，TanStack 的 rowSelection 会保留跨页 row id；
 * 这里需要把当前页已选行和上一轮 v-model:selected 中的跨页行合并回去。
 */
function getSelectedRows(selection: RowSelectionState, previousRows: TData[] = []) {
  const currentRowKeySet = getCurrentRowKeySet()
  const currentSelectedRows = table
    .getPreSelectedRowModel()
    .flatRows.filter((row) => selection[row.id])
    .map((row) => row.original)

  // 不跨页保留时，只向外暴露当前 data 中仍然存在的选中行。
  if (!rowSelectOpts.value.reserveSelectedRowOnPaginate) {
    return currentSelectedRows
  }

  // 跨页保留时，当前页没有的行对象只能从上一轮 selectedRows 中延续。
  const preservedRows = previousRows.filter((item) => {
    const key = String(getSelectedRowKey(item))

    return !currentRowKeySet.has(key) && selection[key]
  })

  const selectedRows = [...preservedRows, ...currentSelectedRows]

  return rowSelectOpts.value.type === 'single' ? selectedRows.slice(0, 1) : selectedRows
}

/**
 * 获取已选中行的唯一键。
 * rowKey 为函数时尽量复用当前 data 中的真实索引，避免数据刷新后索引参数漂移。
 */
function getSelectedRowKey(row: TData) {
  const tableRow = table.getPreSelectedRowModel().flatRows.find((item) => item.original === row)

  if (tableRow) {
    return tableRow.id
  }

  if (typeof props.rowKey !== 'function') {
    return getRowKey(row, 0)
  }

  const dataIndex = props.data.findIndex((item) => item === row)
  return props.rowKey(row, dataIndex === -1 ? 0 : dataIndex)
}

/**
 * 将 v-model:selected 的选中行数组转换成 TanStack 需要的 RowSelectionState。
 * TanStack 支持 rowSelection 中存在当前 row model 之外的 id，
 * 因此跨页保留时可以直接记录全部 selected key。
 */
function getSelectionFromRows(rows: TData[]) {
  const normalizedRows = rowSelectOpts.value.type === 'single' ? rows.slice(0, 1) : rows
  const selectedKeySet = new Set(normalizedRows.map((item) => String(getSelectedRowKey(item))))

  if (rowSelectOpts.value.reserveSelectedRowOnPaginate) {
    return Array.from(selectedKeySet).reduce<RowSelectionState>((selection, key) => {
      selection[key] = true

      return selection
    }, {})
  }

  // 不跨页保留时，只保留当前 data 中仍存在的选中 key。
  return table.getPreSelectedRowModel().flatRows.reduce<RowSelectionState>((selection, row) => {
    const key = row.id

    if (selectedKeySet.has(key)) {
      selection[key] = true
    }

    return selection
  }, {})
}

/**
 * 判断两个选中行数组是否指向同一组选中键。
 * 用于避免 watch 同步 selectedRows 时产生不必要的回写。
 */
function isSameSelection(left: TData[], right: TData[]) {
  if (left.length !== right.length) {
    return false
  }

  return left.every((item, index) => {
    const rightItem = right[index]
    return (
      rightItem !== undefined &&
      String(getSelectedRowKey(item)) === String(getSelectedRowKey(rightItem))
    )
  })
}

/** 当前 data 的 row key 集合，用于区分当前页行和跨页保留行。 */
function getCurrentRowKeySet() {
  return table.getPreSelectedRowModel().flatRows.reduce<Set<string>>((keySet, row) => {
    keySet.add(row.id)

    return keySet
  }, new Set())
}

/**
 * 接收 TanStack 的选中状态更新，并同步到 v-model:selected。
 */
function updateRowSelection(updaterOrValue: Updater<RowSelectionState>) {
  valueUpdater(updaterOrValue, rowSelection)
  selectedRows.value = getSelectedRows(rowSelection.value, selectedRows.value)
}

/**
 * 切换全部可选行，保留 disabled 行原本的选中状态。
 * TanStack 会通过 enableRowSelection 阻止 disabled 行被选中；
 * 这里同步保护取消全选时 disabled 行不被清除。
 */
function toggleAllSelectableRows(selected: boolean) {
  table.setRowSelection((old) =>
    currentSelectableRows.value.reduce<RowSelectionState>(
      (selection, row) => {
        if (selected) {
          selection[row.id] = true
        } else {
          delete selection[row.id]
        }

        return selection
      },
      { ...old },
    ),
  )
}
/**
 * 切换选中状态
 * @param row 行数据
 * @param selected 是否选中
 */
function toggleRowSelected(row: Row<TData>, selected: boolean) {
  if (!row.getCanSelect()) {
    return
  }

  row.toggleSelected(selected)
}

/**
 * 同步外部 v-model:selected、数据源和内部 rowSelection。
 * 数据刷新后如果选中键仍存在，会自动映射到新的行对象。
 */
watch(
  [() => selectedRows.value, () => props.data, rowSelectOpts],
  () => {
    rowSelection.value = getSelectionFromRows(selectedRows.value)
    const nextSelectedRows = getSelectedRows(rowSelection.value, selectedRows.value)

    if (!isSameSelection(selectedRows.value, nextSelectedRows)) {
      selectedRows.value = nextSelectedRows
    }
  },
  { immediate: true, deep: true },
)

/**
 * ====================
 *       滚动监听
 * ====================
 */
const scrollAreaRef = useTemplateRef('scrollAreaRef')
const isAtLeft = ref(true)
const isAtRight = ref(true)

function updateScrollBoundary(target: HTMLElement | null) {
  if (!target) {
    isAtLeft.value = true
    isAtRight.value = true
    return
  }

  const maxScrollLeft = Math.max(0, target.scrollWidth - target.clientWidth)

  isAtLeft.value = target.scrollLeft <= 1
  isAtRight.value = maxScrollLeft - target.scrollLeft <= 1
}

function syncScrollBoundary() {
  nextTick(() => {
    updateScrollBoundary(scrollAreaRef.value?.viewportRef?.viewportElement ?? null)
  })
}

useEventListener(
  () => scrollAreaRef.value?.viewportRef?.viewportElement,
  'scroll',
  (event) => {
    updateScrollBoundary(event.currentTarget as HTMLElement | null)
  },
)

watch([visibleColumns, () => props.data], syncScrollBoundary, {
  immediate: true,
  deep: true,
  flush: 'post',
})

/**
 * ====================
 *      树形数据
 * ====================
 */
/** TanStack expanded 状态；true 表示全部展开，Record 表示按 row id 控制展开。 */
const expanded = ref<ExpandedState>({})
/** 树配置默认值，外部仅需传入要覆盖的字段。 */
const treeOpts = computed<DataTableTreeOptions<TData>>(() => ({
  childrenKey: 'children',
  defaultExpandAll: false,
  expandTreeNodeOnClick: false,
  indent: 24,
  treeNodeColumnIndex: 0,
  ...props.tree,
}))

/** 接收 TanStack 的展开状态更新，并同步到本地 expanded。 */
function updateExpanded(updaterOrValue: Updater<ExpandedState>) {
  valueUpdater(updaterOrValue, expanded)
}

/**
 * 告诉 TanStack 每行的子节点在哪里。
 * 返回 undefined 时，该行会被视为普通叶子节点，不参与展开逻辑。
 */
function getSubRows(row: TData) {
  if (!treeEnabled.value) {
    return undefined
  }

  const children = (row as Record<string, unknown>)[String(treeOpts.value.childrenKey)]

  return Array.isArray(children) ? (children as TData[]) : undefined
}

/** 根据 TanStack 计算出的 row.depth 生成树节点缩进。 */
function getTreeNodeStyle(row: Row<TData>) {
  return {
    paddingLeft: `${row.depth * treeOpts.value.indent}px`,
  }
}

/** 仅在配置的树节点列上渲染展开按钮和缩进。 */
function isTreeNodeCell(cellIndex: number) {
  return treeEnabled.value && cellIndex === treeOpts.value.treeNodeColumnIndex
}

/** 切换单个树节点展开状态；叶子节点直接忽略。 */
function toggleTreeNode(row: Row<TData>) {
  if (!row.getCanExpand()) {
    return
  }

  row.toggleExpanded()
}

/** 配置 expandTreeNodeOnClick 后，点击整行也可以切换树节点。 */
function handleTreeRowClick(row: Row<TData>) {
  if (!treeOpts.value.expandTreeNodeOnClick) {
    return
  }

  toggleTreeNode(row)
}

/** 展开全部 */
function expandAll() {
  table.toggleAllRowsExpanded(true)
}
/** 收起全部 */
function foldAll() {
  table.toggleAllRowsExpanded(false)
}

watch(
  () => treeOpts.value.defaultExpandAll,
  (defaultExpandAll) => {
    // defaultExpandAll 只作为初始化或该配置变化时的默认展开状态，数据刷新时保留当前展开状态。
    expanded.value = defaultExpandAll ? true : {}
  },
  { immediate: true },
)

/**
 * ====================
 *       虚拟滚动
 * ====================
 */
/** tbody 实例，用于计算表体相对页面滚动容器的起始位置。 */
const tableBodyRef = useTemplateRef<ComponentPublicInstance>('tableBodyRef')
/** 纵向滚动容器，默认取布局里的 #page。横向滚动仍由 UiScrollArea 自己处理。 */
const virtualScrollElement = ref<HTMLElement | null>(null)
/** tbody 距离 #page 滚动内容顶部的偏移，用于修正页面滚动容器不是表格自身的场景。 */
const virtualScrollMargin = ref(0)
/** 只有开启参数且能找到 #page 时才启用虚拟滚动，找不到时自动回退为全量渲染。 */
const virtualScrollEnabled = computed(
  () => props.virtualScroll && Boolean(virtualScrollElement.value),
)
/**
 * TanStack Virtual 实例。
 * - estimateSize 只是未测量前的默认行高。
 * - measureVirtualRow 会把真实 tr 高度回填给 virtualizer。
 * - horizontal 固定为 false，仅对纵向行列表做虚拟化。
 */
const rowVirtualizer = useVirtualizer(
  computed(() => ({
    count: tableRows.value.length,
    enabled: virtualScrollEnabled.value,
    // 初始预估行高；真实行高会在行渲染后通过 measureVirtualRow 重新测量。
    estimateSize: () => 60,
    getItemKey: (index) => tableRows.value[index]?.id ?? index,
    getScrollElement: getVirtualScrollElement,
    horizontal: false,
    // 上下额外渲染的行数，减少快速滚动时的空白感。
    overscan: 8,
    scrollMargin: virtualScrollMargin.value,
  })),
)
/** 当前滚动视口内需要渲染的虚拟项。 */
const virtualItems = computed(() =>
  virtualScrollEnabled.value ? rowVirtualizer.value.getVirtualItems() : [],
)
/** 实际交给模板渲染的行；未启用虚拟滚动或虚拟范围尚未生成时回退到全量行。 */
const renderedRows = computed<RenderedTableRow[]>(() => {
  if (!virtualScrollEnabled.value || virtualItems.value.length === 0) {
    return tableRows.value.map((row) => ({ row }))
  }

  return virtualItems.value.reduce<RenderedTableRow[]>((rows, virtualItem) => {
    const row = tableRows.value[virtualItem.index]

    if (row) {
      rows.push({ row, virtualItem })
    }

    return rows
  }, [])
})
/** 视口上方未渲染行的占位高度，用普通 table row 撑起滚动空间。 */
const virtualPaddingTop = computed(() => {
  const firstVirtualItem = virtualItems.value[0]

  if (!virtualScrollEnabled.value || !firstVirtualItem) {
    return 0
  }

  return Math.max(0, firstVirtualItem.start - virtualScrollMargin.value)
})
/** 视口下方未渲染行的占位高度，保证滚动条总高度接近完整表格。 */
const virtualPaddingBottom = computed(() => {
  const lastVirtualItem = virtualItems.value.at(-1)

  if (!virtualScrollEnabled.value || !lastVirtualItem) {
    return 0
  }

  return Math.max(
    0,
    rowVirtualizer.value.getTotalSize() - (lastVirtualItem.end - virtualScrollMargin.value),
  )
})

/** virtualizer 每次更新时通过这个函数拿到当前滚动容器。 */
function getVirtualScrollElement() {
  return virtualScrollElement.value
}

/** 从 DOM 中解析默认页面滚动容器。放在函数里避免 SSR/初始化阶段直接访问 document。 */
function resolveVirtualScrollElement() {
  if (typeof document === 'undefined') {
    return null
  }

  virtualScrollElement.value = document.querySelector<HTMLElement>('#page')

  return virtualScrollElement.value
}

/** 获取 tbody 对应的真实 DOM 元素；UiTableBody 是组件实例，需要取 $el。 */
function getTableBodyElement() {
  return tableBodyRef.value?.$el instanceof HTMLElement
    ? (tableBodyRef.value.$el as HTMLElement)
    : null
}

/** 重新计算 tbody 在 #page 滚动坐标系里的起点，列变化/数据变化/窗口变化后都要更新。 */
function updateVirtualScrollMargin() {
  nextTick(() => {
    const scrollElement = resolveVirtualScrollElement()
    const tableBodyElement = getTableBodyElement()

    if (!scrollElement || !tableBodyElement) {
      virtualScrollMargin.value = 0
      return
    }

    virtualScrollMargin.value =
      tableBodyElement.getBoundingClientRect().top -
      scrollElement.getBoundingClientRect().top +
      scrollElement.scrollTop
  })
}

/** 把实际渲染出的 tr 交给 TanStack Virtual 测量，支持内容撑高后的动态行高。 */
function measureVirtualRow(rowElement: Element | ComponentPublicInstance | null) {
  if (!virtualScrollEnabled.value || !rowElement) {
    return
  }

  const element = rowElement instanceof Element ? rowElement : rowElement.$el

  if (element instanceof Element) {
    rowVirtualizer.value.measureElement(element)
  }
}

onMounted(updateVirtualScrollMargin)

useEventListener(
  () => virtualScrollElement.value?.ownerDocument.defaultView,
  'resize',
  updateVirtualScrollMargin,
)

watch(
  [visibleColumns, tableRows, () => props.virtualScroll],
  () => {
    updateVirtualScrollMargin()
    rowVirtualizer.value.measure()
  },
  { immediate: true, flush: 'post' },
)

/**
 * ====================
 *      通用辅助函数
 * ====================
 */
/**
 * 获取列扩展配置。
 */
function getMeta(columnDef?: ColumnDef<TData, TValue>) {
  return columnDef?.meta as DataTableColumnMeta<TData> | undefined
}
/**
 * 获取 TanStack 用于显隐/固定等状态映射的列 id。
 * 业务列优先使用 accessorKey；展示列、操作列等无 accessorKey 时回退到手动 id。
 */
function getColumnId(columnDef: ColumnDef<TData, TValue>) {
  const accessorKey = getAccessorKey(columnDef)

  if (accessorKey) {
    return accessorKey
  }

  return 'id' in columnDef && columnDef.id != null ? String(columnDef.id) : undefined
}
function isString(value: string | undefined): value is string {
  return typeof value === 'string'
}

defineExpose({ expandAll, foldAll })
</script>

<template>
  <UiScrollArea
    ref="scrollAreaRef"
    :class="cn('relative w-full', props.class)"
    orientation="both"
    barClass="z-2"
    :aria-busy="props.loading"
  >
    <UiTable :class="props.tableClass" tableLayout="fixed">
      <!-- 使用 colgroup + col 控制列宽，避免在 th/td 上重复写宽度。 -->
      <colgroup>
        <col
          v-for="column in visibleColumns"
          :key="column.id"
          :style="{ width: `${column.columnDef.size}px` }"
        />
      </colgroup>

      <!-- 表头渲染：命名插槽优先，其次走 TanStack 原始 header 渲染。 -->
      <UiTableHeader>
        <UiTableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <UiTableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            :data-fixed="header.column.getIsPinned() || undefined"
            :data-shadow-l="
              header.column.getIsPinned() === 'left' &&
              header.column.getIsLastColumn('left') &&
              !isAtLeft
                ? ''
                : undefined
            "
            :data-shadow-r="
              header.column.getIsPinned() === 'right' &&
              header.column.getIsFirstColumn('right') &&
              !isAtRight
                ? ''
                : undefined
            "
            :class="[
              'data-fixed:sticky data-fixed:z-1 data-fixed:transition-shadow',
              'data-shadow-l:after:absolute data-shadow-l:after:z-2 data-shadow-l:after:-top-px data-shadow-l:after:bottom-0 data-shadow-l:after:left-full data-shadow-l:after:shadow-[inset_10px_0_8px_-8px_rgba(5,5,5,0.06)] data-shadow-l:after:w-7.5',
              'data-shadow-r:after:absolute data-shadow-r:after:z-2 data-shadow-r:after:-top-px data-shadow-r:after:bottom-0 data-shadow-r:after:right-full data-shadow-r:after:shadow-[inset_-10px_0_8px_-8px_rgba(5,5,5,0.06)] data-shadow-r:after:w-7.5',
            ]"
            :style="getFixedColumnStyle(header.column)"
          >
            <template v-if="!header.isPlaceholder">
              <template v-if="isRowSelectionColumn(header.column.columnDef)">
                <UiCheckbox
                  v-if="rowSelectOpts.type !== 'single'"
                  :model-value="allRowsSelected"
                  :disabled="
                    !table.getPreSelectedRowModel().flatRows.some((row) => row.getCanSelect())
                  "
                  aria-label="选择全部"
                  @update:model-value="toggleAllSelectableRows($event === true)"
                />
              </template>
              <slot
                v-else-if="$slots[getHeaderSlotName(header)]"
                :name="getHeaderSlotName(header)"
                :header="header"
                :column="header.column"
                :table="table"
              ></slot>
              <FlexRender
                v-else
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </template>
          </UiTableHead>
        </UiTableRow>
      </UiTableHeader>

      <UiTableBody ref="tableBodyRef">
        <!-- 数据行渲染：命名插槽优先，其次走 TanStack 原始 cell 渲染。 -->
        <template v-if="tableRows.length">
          <!-- 虚拟滚动上方占位行：模拟已滚过但未渲染的真实行高度。 -->
          <UiTableRow
            v-if="virtualPaddingTop > 0"
            key="virtual-padding-top"
            class="pointer-events-none hover:bg-transparent"
            :style="{ height: `${virtualPaddingTop}px` }"
          >
            <UiTableCell
              :colspan="visibleColumns.length"
              class="border-0 bg-transparent p-0"
              :style="{ height: `${virtualPaddingTop}px` }"
            />
          </UiTableRow>
          <!--
            真实数据行：
            - data-index 供 TanStack Virtual 识别行索引。
            - ref 会把真实 tr 交给 measureVirtualRow，用于动态测量被内容撑高后的行高。
          -->
          <UiTableRow
            v-for="{ row, virtualItem } in renderedRows"
            :key="row.id"
            :ref="measureVirtualRow"
            :data-index="virtualItem?.index"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
            :class="
              treeOpts.expandTreeNodeOnClick && row.getCanExpand() ? 'cursor-pointer' : undefined
            "
            @click="handleTreeRowClick(row)"
          >
            <UiTableCell
              v-for="(cell, cellIndex) in row.getVisibleCells()"
              :key="cell.id"
              :data-fixed="cell.column.getIsPinned() || undefined"
              :data-shadow-l="
                cell.column.getIsPinned() === 'left' &&
                cell.column.getIsLastColumn('left') &&
                !isAtLeft
                  ? ''
                  : undefined
              "
              :data-shadow-r="
                cell.column.getIsPinned() === 'right' &&
                cell.column.getIsFirstColumn('right') &&
                !isAtRight
                  ? ''
                  : undefined
              "
              :class="[
                'data-fixed:sticky data-fixed:z-1 data-fixed:transition-shadow',
                'data-shadow-l:after:absolute data-shadow-l:after:z-2 data-shadow-l:after:-top-px data-shadow-l:after:bottom-0 data-shadow-l:after:left-full data-shadow-l:after:shadow-[inset_10px_0_8px_-8px_rgba(5,5,5,0.06)] data-shadow-l:after:w-7.5',
                'data-shadow-r:after:absolute data-shadow-r:after:z-2 data-shadow-r:after:-top-px data-shadow-r:after:bottom-0 data-shadow-r:after:right-full data-shadow-r:after:shadow-[inset_-10px_0_8px_-8px_rgba(5,5,5,0.06)] data-shadow-r:after:w-7.5',
              ]"
              :style="getFixedColumnStyle(cell.column)"
            >
              <div
                :class="isTreeNodeCell(cellIndex) ? 'flex min-w-0 items-center' : undefined"
                :style="isTreeNodeCell(cellIndex) ? getTreeNodeStyle(row) : undefined"
              >
                <UiButton
                  v-if="isTreeNodeCell(cellIndex)"
                  variant="ghost"
                  size="xs"
                  :class="[
                    'mr-1 size-5 shrink-0 p-0 text-muted-foreground hover:text-foreground',
                    !row.getCanExpand() && 'invisible pointer-events-none',
                  ]"
                  :aria-label="row.getIsExpanded() ? '收起节点' : '展开节点'"
                  :aria-expanded="row.getCanExpand() ? row.getIsExpanded() : undefined"
                  @click.stop="toggleTreeNode(row)"
                >
                  <MinusIcon v-if="row.getIsExpanded()" class="size-3.5" />
                  <PlusIcon v-else class="size-3.5" />
                </UiButton>
                <template v-if="isRowSelectionColumn(cell.column.columnDef)">
                  <input
                    v-if="rowSelectOpts.type === 'single'"
                    type="radio"
                    class="size-4 accent-brand"
                    :checked="row.getIsSelected()"
                    :disabled="!row.getCanSelect()"
                    aria-label="选择行"
                    @click.stop
                    @change="toggleRowSelected(row, true)"
                  />
                  <UiCheckbox
                    v-else
                    :model-value="row.getIsSelected()"
                    :disabled="!row.getCanSelect()"
                    aria-label="选择行"
                    @click.stop
                    @update:model-value="toggleRowSelected(row, $event === true)"
                  />
                </template>
                <DataTableEllipsis
                  v-else-if="getMeta(cell.column.columnDef)?.ellipsis"
                  class="min-w-0"
                  :table="table"
                  :row="row"
                  :cell="cell"
                >
                  <template
                    v-if="$slots[getCellEllipsisSlotName(cell)]"
                    #tooltip="{
                      cell: tooltipCell,
                      column: tooltipColumn,
                      row: tooltipRow,
                      record: tooltipRecord,
                      value: tooltipValue,
                      table: tooltipTable,
                    }"
                  >
                    <slot
                      :name="getCellEllipsisSlotName(cell)"
                      :cell="tooltipCell"
                      :column="tooltipColumn"
                      :row="tooltipRow"
                      :record="tooltipRecord"
                      :value="tooltipValue"
                      :table="tooltipTable"
                    ></slot>
                  </template>
                  <slot
                    v-if="$slots[getCellSlotName(cell)]"
                    :name="getCellSlotName(cell)"
                    :cell="cell"
                    :column="cell.column"
                    :row="row"
                    :record="row.original"
                    :value="cell.getValue()"
                    :table="table"
                  ></slot>
                  <FlexRender v-else :render="getCellContent(cell)" :props="cell.getContext()" />
                </DataTableEllipsis>
                <slot
                  v-else-if="$slots[getCellSlotName(cell)]"
                  :name="getCellSlotName(cell)"
                  :cell="cell"
                  :column="cell.column"
                  :row="row"
                  :record="row.original"
                  :value="cell.getValue()"
                  :table="table"
                ></slot>
                <FlexRender v-else :render="getCellContent(cell)" :props="cell.getContext()" />
              </div>
            </UiTableCell>
          </UiTableRow>
          <!-- 虚拟滚动下方占位行：补齐当前视口之后尚未渲染的行高度。 -->
          <UiTableRow
            v-if="virtualPaddingBottom > 0"
            key="virtual-padding-bottom"
            class="pointer-events-none hover:bg-transparent"
            :style="{ height: `${virtualPaddingBottom}px` }"
          >
            <UiTableCell
              :colspan="visibleColumns.length"
              class="border-0 bg-transparent p-0"
              :style="{ height: `${virtualPaddingBottom}px` }"
            />
          </UiTableRow>
        </template>
        <!-- 空状态会自动按当前可见列数量合并单元格。 -->
        <UiTableEmpty v-else :colspan="visibleColumns.length">
          {{ emptyText }}
        </UiTableEmpty>
      </UiTableBody>
    </UiTable>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="props.loading"
        class="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur-[1px]"
      >
        <UiSpinner class="size-6 text-primary" />
      </div>
    </Transition>
  </UiScrollArea>
</template>
