import { get } from 'es-toolkit/compat'
import { useLocale } from 'reka-ui'
import { toRef } from 'vue'

import { enUS } from './en-US'
import type { UiMessageArgs, UiMessageKey } from './types'
import { zhCN } from './zh-CN'

export { enUS } from './en-US'
export { zhCN } from './zh-CN'
export type { UiMessageKey } from './types'

const locales = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

export type UiLocaleCode = keyof typeof locales

/** @internal */
export function resolveUiLocale(code?: string): UiLocaleCode {
  return code && Object.hasOwn(locales, code) ? (code as UiLocaleCode) : 'zh-CN'
}

export function useUiLocale() {
  const rekaLocale = useLocale()
  const locale = toRef(() => resolveUiLocale(rekaLocale.value))

  function t<K extends UiMessageKey>(key: K, ...args: UiMessageArgs<K>): string {
    const message = get(locales[locale.value], key, key)
    const params: Record<string, string | number> | undefined = args[0]
    if (!params) return message

    return message.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
      Object.hasOwn(params, name) ? String(params[name]) : placeholder,
    )
  }

  return { t, locale }
}
