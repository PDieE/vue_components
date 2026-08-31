<script setup lang="ts">
import { omit } from 'es-toolkit'
import type { AspectRatioProps } from 'reka-ui'
import type { HTMLAttributes, ImgHTMLAttributes } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const { ratio, src, ...props } = defineProps<
  Pick<AspectRatioProps, 'ratio'> & {
    class?: HTMLAttributes['class']
    /** 图片 src */
    src: ImgHTMLAttributes['src']
  }
>()
</script>

<template>
  <div :class="props.class" v-bind="$attrs">
    <UiAspectRatio :ratio="ratio" as-child>
      <img class="size-full object-cover" v-bind="omit(props, ['class'])" :src="src" />
    </UiAspectRatio>
  </div>
</template>
