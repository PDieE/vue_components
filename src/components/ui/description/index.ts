import { createInjectionState } from '@vueuse/core'
import { computed, toValue } from 'vue'
import type { MaybeRef } from 'vue'

export type DescriptionOrientation = 'horizontal' | 'vertical'
export type DescriptionLabelWidth = number | string

const [useProvideDescriptionState, useDescriptionState] = createInjectionState(
  (
    orientation: MaybeRef<DescriptionOrientation>,
    column: MaybeRef<number>,
    labelWidth?: MaybeRef<DescriptionLabelWidth | undefined>,
  ) => ({
    orientation: computed(() => toValue(orientation)),
    column: computed(() => toValue(column)),
    labelWidth: computed(() => (labelWidth === undefined ? undefined : toValue(labelWidth))),
  }),
)

export { default as UiDescription } from './Description.vue'
export { default as UiDescriptionItem } from './DescriptionItem.vue'
export { useDescriptionState, useProvideDescriptionState }
