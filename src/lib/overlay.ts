/**
 * 点击这些独立挂载的浮层时，不应触发应用内 Dialog、Sheet 等浮层的外部交互关闭。
 */
export const OVERLAY_INTERACT_EXEMPT_SELECTORS = [
  '[data-sonner-toaster]',
  '#__vue-devtools-container__',
  '#vue-devtools-anchor',
  '.vue-devtools-frame',
] as const

export function isOverlayInteractExempt(target: EventTarget | null) {
  return (
    target instanceof Element &&
    OVERLAY_INTERACT_EXEMPT_SELECTORS.some((selector) => target.closest(selector))
  )
}
