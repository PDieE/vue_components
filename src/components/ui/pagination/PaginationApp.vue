<script setup lang="ts">
import type { PaginationRootEmits, PaginationRootProps } from 'reka-ui'
import { useForwardPropsEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<
  PaginationRootProps & {
    class?: HTMLAttributes['class']
  }
>()
const emits = defineEmits<
  PaginationRootEmits & {
    change: [value: number]
  }
>()

const forwarded = useForwardPropsEmits(props)

/**
 * 页码变更回调
 * @param value 页码
 */
function change(value: number) {
  if (value === props.page) return
  emits('change', value)
  emits('update:page', value)
}
</script>

<template>
  <UiPagination v-slot="{ page }" v-bind="forwarded" @update:page="change">
    <UiPaginationContent v-slot="{ items }">
      <UiPaginationPrevious />

      <template v-for="(item, index) in items">
        <UiPaginationItem
          v-if="item.type === 'page'"
          :key="item.value"
          :value="item.value"
          :is-active="item.value === page"
        >
          {{ item.value }}
        </UiPaginationItem>
        <UiPaginationEllipsis v-else :key="item.type" :index="index" />
      </template>

      <UiPaginationNext />
    </UiPaginationContent>
  </UiPagination>
</template>
