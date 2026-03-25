import React from "react";
import { useFormik, FormikHelpers } from "formik";
import { ObjectSchema, AnyObject } from "yup";

interface UseFormOptions<T extends AnyObject> {
  initialValues: T;
  schema: ObjectSchema<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

type FieldErrors<T> = {
  [K in keyof T]?: string;
};

type FieldTouched<T> = {
  [K in keyof T]?: boolean;
};

interface UseFormReturn<T extends AnyObject> {
  values: T;
  errors: FieldErrors<T>;
  touched: FieldTouched<T>;
  formError: string;
  formSuccess: string;
  isSubmitting: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleBlur: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setFormError: (msg: string) => void;
  setFormSuccess: (msg: string) => void;
  setFieldValue: (name: keyof T, value: unknown) => void;
  reset: () => void;
}

const useForm = <T extends AnyObject>({
  initialValues,
  schema,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> => {
  const [formError, setFormError] = React.useState("");
  const [formSuccess, setFormSuccess] = React.useState("");

  const formik = useFormik<T>({
    initialValues,
    validationSchema: schema,
    validateOnBlur: true,
    validateOnChange: true,

    onSubmit: async (values: T, helpers: FormikHelpers<T>) => {
      setFormError("");
      setFormSuccess("");
      try {
        await onSubmit(values);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Something went wrong.";
        setFormError(message);
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const errors = formik.errors as FieldErrors<T>;
  const touched = formik.touched as FieldTouched<T>;

  const setFieldValue = (name: keyof T, value: unknown) => {
    formik.setFieldValue(name as string, value, true);
    formik.setFieldTouched(name as string, true, false);
  };

  const reset = () => {
    formik.resetForm();
    setFormError("");
    setFormSuccess("");
  };

  return {
    values: formik.values,
    errors,
    touched,
    formError,
    formSuccess,
    isSubmitting: formik.isSubmitting,
    handleChange: formik.handleChange,
    handleBlur: formik.handleBlur,
    handleSubmit: formik.handleSubmit,
    setFormError,
    setFormSuccess,
    setFieldValue,
    reset,
  };
};

export default useForm;
