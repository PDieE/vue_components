import type dayjs from 'dayjs'

/** 禁用日期 */
export type DisableDate = Array<DateValue> | DisableDateObj | ((date: dayjs.Dayjs) => boolean)

/** 日期值 */
export type DateValue = string | number | Date | dayjs.Dayjs

/** 禁用日期对象 */
export interface DisableDateObj {
  /** 开始禁用日期 */
  from?: DateValue
  /** 结束禁用日期 */
  to?: DateValue
  /** 禁用之前日期 */
  before?: DateValue
  /** 禁用之后日期 */
  after?: DateValue
}

export * as DatePicker from './DatePicker.vue'
export * as DatePickerRange from './DatePickerRange.vue'
