"use client";

import { Form } from "antd";
import { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import isEqual from "lodash.isequal";

export default function FormWrapper({
  onSubmit,
  children,
  defaultValues,
  resolver,
  formRef,
  from,
}) {
  const preventDefaultValuesRef = useRef();
  const formConfig = {};

  if (resolver) {
    formConfig["resolver"] = resolver;
  }

  // set default value-------------------------
  const methods = useForm(formConfig);

  // Expose the reset method to parent
  useEffect(() => {
    if (formRef) {
      formRef.current = {
        reset: methods.reset,
      };
    }
  }, [formRef, methods.reset]);

  // ✅ Deep compare manually using lodash
  useEffect(() => {
    if (!isEqual(preventDefaultValuesRef.current, defaultValues)) {
      preventDefaultValuesRef.current = defaultValues;
      if (defaultValues) {
        methods.reset(defaultValues);
      }
    }
  }, [defaultValues, methods]);

  useEffect(() => {
    if (defaultValues) {
      // Set default values after form is mounted
      methods.reset(defaultValues);
    }
  }, [defaultValues, methods]);

  const handleSubmit = (data) => {
    onSubmit(data, {reset: methods.reset});
  };

  return (
    <FormProvider {...methods}>
      <Form
        {...from}
        layout="vertical"
        onFinish={methods.handleSubmit(handleSubmit)}
      >
        {children}
      </Form>
    </FormProvider>
  );
}
