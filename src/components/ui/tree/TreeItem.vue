<script setup lang="ts" generic="T extends Record<string, any>">
import { Icon } from '@iconify/vue'
import { omit } from 'es-toolkit'
import type { TreeItemProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import type { BadgeProps } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const props = defineProps<
  TreeItemProps<T> & {
    class?: HTMLAttributes['class']
    /** 是否扁平化列表 */
    flatten?: boolean
    /** 图标 */
    icon?: string
    /** 标题 */
    label: string
    /** 二级标题 */
    subLabel?: string
    /** 徽标 */
    badge?: number | string | BadgeProps
    /** 是否有子项 */
    hasChildren?: boolean
  }
>()

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const badgeProps = computed<(BadgeProps & { str?: string }) | undefined>(() => {
  if (!props.badge) return undefined

  if (typeof props.badge === 'number') {
    return {
      variant: 'destructive',
      count: props.badge,
    }
  }

  if (typeof props.badge === 'string') {
    return {
      variant: 'destructive',
      str: props.badge,
    }
  }
  return { variant: 'destructive', ...props.badge }
})
</script>

<template>
  <RkTreeItem
    v-slot="slots"
    :style="{ 'padding-left': `calc(${props.level} * 14px - 2px)` }"
    v-bind="omit(props, ['class'])"
    :class="
      cn(
        'group/tree-item px-3 py-2.5 text-foreground-4 text-sm font-medium rounded-md outline-none',
        'cursor-pointer transition-colors hover:bg-layout data-selected:bg-brand-bg data-selected:hover:bg-brand-bg-hover data-selected:text-brand data-selected:hover:text-brand-hover',
        'flex items-center gap-2',
        props.class,
      )
    "
  >
    <slot v-bind="slots">
      <UiButton
        v-if="!props.flatten"
        variant="ghost"
        size="icon-xs"
        :disabled="!props.hasChildren"
        :class="!props.hasChildren && 'pointer-events-none opacity-0!'"
        @click.stop="props.hasChildren && slots.handleToggle()"
      >
        <Icon
          icon="icon-park-outline:right"
          class="h-4 w-4 transition-transform group-data-expanded/tree-item:rotate-90"
        />
      </UiButton>
      <slot v-bind="slots" name="icon">
        <Icon v-if="props.icon" :icon="props.icon" class="h-4 w-4" />
      </slot>

      <div v-if="props.subLabel" class="flex-1">
        <div
          class="truncate text-xs text-foreground-3 group-data-selected/tree-item:text-brand group-data-selected/tree-item:hover:text-brand"
        >
          {{ props.subLabel }}
        </div>
        <div class="truncate">{{ props.label }}</div>
      </div>
      <span v-else class="flex-1 truncate">{{ props.label }}</span>

      <slot name="action" v-bind="slots" />

      <UiBadge
        v-if="badgeProps && badgeProps?.str === undefined && badgeProps?.count"
        v-bind="badgeProps"
      />
      <UiBadge v-if="badgeProps && typeof badgeProps?.str === 'string'" v-bind="badgeProps">
        {{ badgeProps.str }}
      </UiBadge>
    </slot>
  </RkTreeItem>
</template>
