<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'

import { cn } from '@/lib/utils'

interface AvatarNameAppProps {
  name?: string | null
  src?: string | null
  alt?: string
  class?: HTMLAttributes['class']
  avatarClass?: HTMLAttributes['class']
  avatarFallbackClass?: HTMLAttributes['class']
  nameClass?: HTMLAttributes['class']
  shape?: 'square' | 'circle'
  theme?: 'default' | 'brand'
}

const props = withDefaults(defineProps<AvatarNameAppProps>(), {
  name: '',
  src: '',
  shape: 'circle',
  theme: 'default',
})

const fallbackPalette = [
  'bg-[linear-gradient(180deg,_#206CCF_0%,_#6BA6FF_100%)] text-white',
  'bg-[linear-gradient(180deg,_#FF793B_0%,_#FFA894_100%)] text-white',
  'bg-[linear-gradient(180deg,_#6172F3_0%,_#8D9AFF_100%)] text-white',
  'bg-[linear-gradient(180deg,_#FF455D_0%,_#FF7D84_100%)] text-white',
  'bg-[linear-gradient(180deg,_#0DB2AF_0%,_#07C6C2_100%)] text-white',
] as const

const displayName = computed(() => props.name?.trim() || '-')

const fallbackText = computed(() => {
  const text = props.name?.trim()
  return text ? text.charAt(0) : '-'
})

const avatarAlt = computed(() => props.alt || displayName.value)
const fallbackToneClass = computed(() => {
  const seed = props.name?.trim() || fallbackText.value
  let hash = 0

  for (const char of seed) {
    hash = (hash * 31 + (char.codePointAt(0) || 0)) >>> 0
  }

  return fallbackPalette[hash % fallbackPalette.length]
})

const fallbackClass = computed(() => cn(fallbackToneClass.value, props.avatarFallbackClass))
</script>

<template>
  <div :class="cn('flex min-w-0 items-center gap-2', props.class)">
    <UiAvatarApp
      :src="props.src || ''"
      :alt="avatarAlt"
      :shape="props.shape"
      :theme="props.theme"
      :class="cn('size-6 shrink-0 text-[12px]', props.avatarClass)"
      :fallback-class="fallbackClass"
    >
      {{ fallbackText }}
    </UiAvatarApp>
    <span :class="cn('truncate', props.nameClass)">
      {{ displayName }}
    </span>
  </div>
</template>
