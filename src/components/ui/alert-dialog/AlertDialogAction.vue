<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import type { AlertDialogActionProps } from 'reka-ui'
import { AlertDialogAction } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { type ButtonVariants, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const { theme = 'brand', ...props } = defineProps<
  AlertDialogActionProps & { class?: HTMLAttributes['class']; theme: ButtonVariants['theme'] }
>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <AlertDialogAction v-bind="delegatedProps" :class="cn(buttonVariants({ theme }), props.class)">
    <slot />
  </AlertDialogAction>
</template>
