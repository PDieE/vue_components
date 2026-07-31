import { toTypedSchema } from '@vee-validate/zod';
import { cloneDeep } from 'es-toolkit';
import { useForm, type GenericObject } from 'vee-validate';
import { z } from 'zod';

/** Vee 表单逻辑处理钩子参数 */
export interface UseVeeFormOptions<TSchema extends z.ZodType<GenericObject, GenericObject>, R> {
  /**
   * 请求
   * @param arg
   * @returns
   */
  request: (params: z.output<TSchema>) => Promise<R>;
  /**
   * 表单默认值
   */
  initialValues: Partial<z.input<TSchema>>;
  /**
   * zod 校验 schema
   */
  schema: MaybeRefOrGetter<TSchema>;
}

/**
 * VeeValidate + zod 表单逻辑处理钩子
 */
export function useVeeForm<TSchema extends z.ZodType<GenericObject, GenericObject>, R = any>(
  opts: UseVeeFormOptions<TSchema, R>,
) {
  const { request, initialValues, schema } = opts;

  const submitting = shallowRef(false);

  const form = useForm<z.input<TSchema>, z.output<TSchema>>({
    validationSchema: computed(() => toTypedSchema(toValue(schema))),
    initialValues: cloneDeep(initialValues) as never,
  });

  /**
   * 提交
   */
  async function submit() {
    const result = await form.validate();
    if (!result.valid) {
      return Promise.reject(result.errors);
    }

    submitting.value = true;
    try {
      return await request(result.values as z.output<TSchema>);
    } finally {
      submitting.value = false;
    }
  }

  /**
   * 重置表单
   */
  function reset(values?: Partial<z.input<TSchema>>) {
    const mergedValues = {
      ...(cloneDeep(initialValues) as GenericObject),
      ...(values as GenericObject | undefined),
    };

    form.resetForm({
      values: mergedValues as never,
    });
  }

  /**
   * 修复一些老旧自定义组件的验证问题
   */
  function fieldValidFix(fields: string[]) {
    setTimeout(() => {
      fields.forEach((field) => {
        void form.validateField(field as never);
      });
    }, 0);
  }

  return {
    form,
    formData: form.values,
    initialValues,
    submitting,
    submit,
    reset,
    fieldValidFix,
  };
}
