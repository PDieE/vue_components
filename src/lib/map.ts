import type { MapOptionValue } from '@/components/ui/tag'

/**
 * 根据值获取对应的映射选项，未匹配时返回 undefined
 * @param options 映射选项列表
 * @param value 待匹配的值
 * @param strict 是否严格匹配，默认转为字符串后比较
 */
export function getMapOption<T extends MapOption>(
  options: readonly T[],
  value: MapOptionValue,
  strict = false,
): T | undefined {
  return options.find((item) =>
    strict ? item.value === value : String(item.value) === String(value),
  )
}
