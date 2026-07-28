export { default as Input } from './Input.vue'
export { default as InputApp } from './InputApp.vue'
export { default as InputCompare } from './InputCompare.vue'

/** 对比输入框 */
export interface InputCompareValue {
  /** 对比符 */
  compare: string
  /** 对比值 */
  value: string | number
}
