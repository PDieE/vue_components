<script setup lang="ts">
import { pick } from 'es-toolkit'
import type { AvatarFallbackProps, AvatarImageProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 图片地址 */
    src?: AvatarImageProps['src']
    /** 跨域 */
    crossOrigin?: AvatarImageProps['crossOrigin']
    /** 引用策略 */
    referrerPolicy?: AvatarImageProps['referrerPolicy']
    /** 替代文本 */
    alt?: string
    /** 适用于延迟渲染，使其仅在网络较慢的用户设备上展示。 */
    fallbackDelayMs?: AvatarFallbackProps['delayMs']
    /** 形状 */
    shape?: 'square' | 'circle'
    class?: HTMLAttributes['class']
    /** 主题 */
    theme?: 'default' | 'brand'
    fallbackClass?: HTMLAttributes['class']
  }>(),
  { src: '', shape: 'circle', theme: 'default' },
)
</script>

<template>
  <UiAvatar :class="[props.shape === 'square' ? 'rounded' : '', props.class]">
    <UiAvatarImage
      v-if="props.src"
      v-bind="pick(props, ['src', 'crossOrigin', 'referrerPolicy', 'alt'])"
    />
    <UiAvatarFallback
      v-bind="pick(props, ['fallbackDelayMs', 'theme'])"
      :class="props.fallbackClass"
      v-if="$slots.default"
    >
      <slot></slot>
    </UiAvatarFallback>
  </UiAvatar>
</template>
