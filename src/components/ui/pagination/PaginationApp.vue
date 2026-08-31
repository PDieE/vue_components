<script setup lang="ts">
import type { PaginationRootEmits, PaginationRootProps } from 'reka-ui'
import { useForwardPropsEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const itemsPerPage = defineModel<number>('itemsPerPage', { default: 10 })

const {
  showPerPageChanger = true,
  perPageOptions = [10, 20, 50, 100],
  ...props
} = defineProps<
  PaginationRootProps & {
    /** 是否展示每页条数选择器。 */
    showPerPageChanger?: boolean
    /** 每页条数可选项。 */
    perPageOptions?: number[]
    class?: HTMLAttributes['class']
  }
>()
const emits = defineEmits<
  PaginationRootEmits & {
    /** 页码或每页条数变更回调。 */
    change: [page: number, perPage: number]
  }
>()

const forwarded = useForwardPropsEmits(props)

/**
 * 页码变更回调
 * @param value 页码
 */
function change(page: number) {
  if (page === props.page) return
  emits('change', page, itemsPerPage.value)
  emits('update:page', page)
}
/**
 * 每页条数变更后回到第一页
 * @param value 每页条数
 */
function changeItemsPerPage(value: unknown) {
  const size = Number(value)
  if (!Number.isFinite(size)) return

  emits('change', 1, size)
  emits('update:page', 1)
}
</script>

<template>
  <UiPagination
    v-slot="{ page }"
    v-bind="forwarded"
    :items-per-page="itemsPerPage"
    @update:page="change"
  >
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

      <UiCombobox
        v-if="showPerPageChanger"
        v-model="itemsPerPage"
        :clearable="false"
        :options="perPageOptions.map((value) => ({ value, label: `${value} 条/页` }))"
        @change="changeItemsPerPage"
      />
    </UiPaginationContent>
  </UiPagination>
</template>
