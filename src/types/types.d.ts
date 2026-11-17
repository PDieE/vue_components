/** 映射选项 */
interface MapOption {
  /** 显示文本 */
  label: string
  /** 值 */
  value: string | null | number | boolean
  /** 颜色，目前主要用于Tag */
  color?: 'blue' | 'success' | 'purple' | 'error' | 'default' | 'warning'
}
