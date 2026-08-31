const [useProvideFormState, useFormState] = createInjectionState(
  (disabled: ComputedRef<boolean>) => {
    return {
      disabled,
    }
  },
)

export { useProvideFormState, useFormState }

export function useFormStateWithDefault() {
  return (
    useFormState() ?? {
      disabled: computed(() => false),
    }
  )
}
