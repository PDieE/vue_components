import type { Cell, ColumnDef, Row, RowData } from '@tanstack/vue-table'

export { default as DataTable } from './DataTable.vue'

/** 表格列 */
export type DataTableColumn<TData extends RowData, TValue = unknown> = Extract<
  ColumnDef<TData, TValue>,
  { accessorKey?: unknown }
> & {
  meta?: DataTableColumnMeta<TData>
}

/** 表格列元信息 */
export interface DataTableColumnMeta<TData extends RowData> {
  /** 固定列位置，传 left/right 时会同步写入 TanStack columnPinning。 */
  fixed?: 'left' | 'right'
  /** 单元格内容过长时是否使用省略展示。省略时会有Tooltip悬浮显示全部 */
  ellipsis?: boolean
  /** 列是否可见，默认 true；只有传 false 时才会写入 TanStack columnVisibility。 */
  visible?: boolean
  /** 选择列配置，仅对 accessorKey: 'row-select' 生效。 */
  selectOptions?: DataTableColumnMetaSelectOptions<TData>
}

/** 表格列选择配置 */
export interface DataTableColumnMetaSelectOptions<TData extends RowData> {
  /** 行选择类型，single 为单选，multiple 为多选，默认 multiple。 */
  type?: 'single' | 'multiple'
  /** 是否禁用 */
  disabled?: (row: Row<TData>) => boolean
  /** 翻页/刷新当前 data 时是否保留不在当前页的已选行，默认 true。 */
  reserveSelectedRowOnPaginate?: boolean
}

/**
 * 获取单元格插槽名称。
 * 优先使用 accessorKey，无法取得时回退到列 id。
 * @param cell 单元格
 */
export function getCellSlotName<TData, TValue>(cell: Cell<TData, TValue>) {
  return getAccessorKey<TData, TValue>(cell.column.columnDef) ?? cell.column.id
}

/**
 * 获取省略 Tooltip 内容插槽名称。
 * 例如 result 单元格对应 ellipsisResult，可自定义 Tooltip 展示内容。
 * @param cell 单元格
 */
export function getCellEllipsisSlotName<TData, TValue>(cell: Cell<TData, TValue>) {
  const slotName = getCellSlotName(cell)

  return `ellipsis${slotName.charAt(0).toUpperCase()}${slotName.slice(1)}`
}

/**
 * 从 ColumnDef 中安全读取 accessorKey。
 * cell 插槽名称优先使用字段键，因此需要兼容 accessorKey 可能不存在的列。
 * @param columnDef 列定义
 */
export function getAccessorKey<TData, TValue>(columnDef: ColumnDef<TData, TValue>) {
  return 'accessorKey' in columnDef && columnDef.accessorKey != null
    ? String(columnDef.accessorKey)
    : undefined
}

/**
 * 获取单元格内容
 * @param cell 单元格
 */
export function getCellContent<TData, TValue>(cell: Cell<TData, TValue>) {
  const cellDef = cell.column.columnDef.cell

  if (!cellDef) return '-'

  if (typeof cellDef === 'string') return cellDef

  const res = cellDef(cell.getContext())

  return res || '-'
}
