import type { HTMLAttributes } from 'vue'

export { default as WheelPicker } from './WheelPicker.vue'
export { default as WheelPickerGroup } from './WheelPickerGroup.vue'

export type WheelPickerValue = string | number

export interface WheelPickerOption {
  label: string | number
  value: WheelPickerValue
  disabled?: boolean
}

export interface WheelPickerGroupColumn {
  options: WheelPickerOption[]
  disabled?: boolean
  class?: HTMLAttributes['class']
}
