export { default as AlertDialog } from './AlertDialog.vue'
export { default as AlertDialogAction } from './AlertDialogAction.vue'
export { default as AlertDialogApp } from './AlertDialogApp.vue'
export { default as AlertDialogCancel } from './AlertDialogCancel.vue'
export { default as AlertDialogContent } from './AlertDialogContent.vue'
export { default as AlertDialogDescription } from './AlertDialogDescription.vue'
export { default as AlertDialogFooter } from './AlertDialogFooter.vue'
export { default as AlertDialogHeader } from './AlertDialogHeader.vue'
export { default as AlertDialogTitle } from './AlertDialogTitle.vue'
export { default as AlertDialogTrigger } from './AlertDialogTrigger.vue'
import type { ButtonVariants } from '@/components/ui/button'

export interface AlertDialogAppProps {
  /** 标题 */
  title?: string
  /** 描述 */
  description?: string
  /** 确认按钮文案 */
  confirmText?: string
  /** 取消按钮文案 */
  cancelText?: string
  /** 确认按钮主题 */
  confirmTheme?: ButtonVariants['theme']
  /** 是否允许按 Escape 关闭，默认允许 */
  closeOnEscape?: boolean
}
