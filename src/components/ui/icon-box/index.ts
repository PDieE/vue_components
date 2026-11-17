export { default as IconBox } from './IconBox.vue'

/** 图标背景与前景配色 */
export const iconBoxColorVariants = {
  default: { background: 'bg-layout', foreground: 'text-foreground-3' },
  success: { background: 'bg-[#ECFDF5]', foreground: 'text-[#16A34A]' },
  blue: { background: 'bg-[#EFF6FF]', foreground: 'text-[#2563EB]' },
  cyan: { background: 'bg-[rgba(224,255,248,0.75)]', foreground: 'text-[#0AA5A8]' },
  indigo: { background: 'bg-[#EEF2FF]', foreground: 'text-[#4F46E5]' },
  warning: { background: 'bg-[#FFFBEB]', foreground: 'text-[#D97706]' },
  purple: { background: 'bg-[#F7EFFF]', foreground: 'text-[#9333EA]' },
  error: { background: 'bg-[#FEF2F2]', foreground: 'text-[#DC2626]' },
}

/** 图标预制色 */
export type IconBoxColor = keyof typeof iconBoxColorVariants
