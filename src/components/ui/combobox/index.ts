export { default as Combobox } from './Combobox.vue'
export { default as ComboboxCascader } from './ComboboxCascader.vue'

/** 组合框元素值 */
export type ComboboxValue = string | number | bigint | null

/** 组合框的 v-model / change 事件值 */
export type ComboboxModelValue = ComboboxValue | ComboboxValue[] | undefined

/** 组合框元素 */
export interface ComboboxOption {
  /**
   * 类型
   * @describe separator: 分隔符;
   */
  type?: 'separator'
  /** 值 */
  value?: ComboboxValue
  /** 标签 */
  label?: string
  /** 是否禁用 */
  disabled?: boolean
}

/** 组合框 change 事件携带的选项 */
export type ComboboxChangeOption = ComboboxOption | ComboboxOption[] | undefined

/** 级联选择器选项 */
export interface ComboboxOptionCascader extends ComboboxOption {
  /** 子选项 */
  children?: ComboboxOptionCascader[]
}
