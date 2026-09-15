<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'

import { cn } from '@/lib/utils'

const {
  src = '',
  alt,
  name = '',
  nameClass,
  subName,
  avatarClass,
  avatarFallbackClass,
  shape = 'circle',
  theme = 'default',
  ...props
} = defineProps<{
  class?: HTMLAttributes['class']
  /** 名称 */
  name?: string | null
  /** 头像 */
  src?: string | null
  alt?: string
  /** 头像类名 */
  avatarClass?: HTMLAttributes['class']
  /** 头像回退类名 */
  avatarFallbackClass?: HTMLAttributes['class']
  /** 名称类名 */
  nameClass?: HTMLAttributes['class']
  /** 子名称 */
  subName?: string | null
  /** 形状 */
  shape?: 'square' | 'circle'
  /** 主题 */
  theme?: 'default' | 'brand'
}>()

const fallbackPalette = [
  'bg-[linear-gradient(180deg,_#206CCF_0%,_#6BA6FF_100%)] text-white',
  'bg-[linear-gradient(180deg,_#FF793B_0%,_#FFA894_100%)] text-white',
  'bg-[linear-gradient(180deg,_#6172F3_0%,_#8D9AFF_100%)] text-white',
  'bg-[linear-gradient(180deg,_#FF455D_0%,_#FF7D84_100%)] text-white',
  'bg-[linear-gradient(180deg,_#0DB2AF_0%,_#07C6C2_100%)] text-white',
] as const

const displayName = computed(() => name?.trim() || '-')

const fallbackText = computed(() => {
  const text = name?.trim()
  return text ? text.charAt(0) : '-'
})

const avatarAlt = computed(() => alt || displayName.value)
const fallbackToneClass = computed(() => {
  const seed = name?.trim() || fallbackText.value
  let hash = 0

  for (const char of seed) {
    hash = (hash * 31 + (char.codePointAt(0) || 0)) >>> 0
  }

  return fallbackPalette[hash % fallbackPalette.length]
})

const fallbackClass = computed(() => cn(fallbackToneClass.value, avatarFallbackClass))
</script>

<template>
  <div :class="cn('flex min-w-0 items-center gap-2', props.class)">
    <UiAvatarApp
      :src="src || ''"
      :alt="avatarAlt"
      :shape="shape"
      :theme="theme"
      :class="cn('size-6 shrink-0 text-[12px]', avatarClass)"
      :fallback-class="fallbackClass"
    >
      {{ fallbackText }}
    </UiAvatarApp>
    <div v-if="subName" class="flex-1 overflow-hidden">
      <div :class="cn('truncate', nameClass)">
        {{ displayName }}
      </div>
      <div class="text-foreground-2 text-xs truncate">
        {{ subName }}
      </div>
    </div>
    <span v-else :class="cn('truncate', nameClass)">
      {{ displayName }}
    </span>
  </div>
</template>
