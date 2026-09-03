<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import Card from './Card.vue'
import CardAction from './CardAction.vue'
import CardContent from './CardContent.vue'
import CardDescription from './CardDescription.vue'
import CardFooter from './CardFooter.vue'
import CardHeader from './CardHeader.vue'
import CardTitle from './CardTitle.vue'

defineOptions({
  inheritAttrs: false,
})

const {
  title,
  titleClass,
  description,
  descriptionClass,
  shadow,
  headerClass,
  actionClass,
  contentClass,
  footerClass,
  ...props
} = defineProps<{
  /** 卡片标题 */
  title?: string
  /** 标题 class */
  titleClass?: HTMLAttributes['class']
  /** 卡片描述 */
  description?: string
  /** 描述 class */
  descriptionClass?: HTMLAttributes['class']
  /** 是否显示阴影 */
  shadow?: boolean
  class?: HTMLAttributes['class']
  /** 标题区域 class */
  headerClass?: HTMLAttributes['class']
  /** 操作区 class */
  actionClass?: HTMLAttributes['class']
  /** 内容区域 class */
  contentClass?: HTMLAttributes['class']
  /** 页脚区域 class */
  footerClass?: HTMLAttributes['class']
}>()
</script>

<template>
  <Card v-bind="props" :shadow="shadow">
    <CardHeader
      v-if="title || description || $slots.title || $slots.description || $slots.action"
      :class="headerClass"
    >
      <CardTitle v-if="title || $slots.title" :class="titleClass">
        <slot name="title">{{ title }}</slot>
      </CardTitle>
      <CardDescription v-if="description || $slots.description" :class="descriptionClass">
        <slot name="description">{{ description }}</slot>
      </CardDescription>
      <CardAction v-if="$slots.action" :class="actionClass">
        <slot name="action" />
      </CardAction>
    </CardHeader>

    <CardContent v-if="$slots.default" :class="contentClass">
      <slot />
    </CardContent>

    <CardFooter v-if="$slots.footer" :class="footerClass">
      <slot name="footer" />
    </CardFooter>
  </Card>
</template>
