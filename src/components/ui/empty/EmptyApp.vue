<script setup lang="ts">
import type { EmptyAppProps } from '.'
import EmptySvg from './empty.svg'

const { mediaVariant, ...props } = defineProps<EmptyAppProps>()
</script>

<template>
  <UiEmpty :class="props.class">
    <UiEmptyHeader>
      <UiEmptyMedia :variant="mediaVariant">
        <slot name="media">
          <div class="pl-4.75">
            <EmptySvg />
          </div>
        </slot>
      </UiEmptyMedia>
      <UiEmptyTitle v-if="title || $slots.title">
        <slot name="title">{{ title }}</slot>
      </UiEmptyTitle>
      <UiEmptyDescription v-if="description || $slots.description">
        <slot name="description">{{ description }}</slot>
      </UiEmptyDescription>
    </UiEmptyHeader>
    <UiEmptyContent>
      <slot name="content" />
    </UiEmptyContent>
    <slot />
  </UiEmpty>
</template>
