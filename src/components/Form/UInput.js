"use client";

import { Form, Input, InputNumber } from "antd";
import { Controller } from "react-hook-form";

const UInput = ({
  type,
  name,
  label,
  size,
  placeholder,
  defaultValue,
  disabled = false,
  labelStyles = {},
  className,
  suffix,
  style,
  max,
  required,
  dir,
}) => {
  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={
            Object.keys(labelStyles)?.length > 0 ? (
              <label style={labelStyles}>{label}</label>
            ) : (
              label
            )
          }
          validateStatus={error ? "error" : ""}
          help={error ? error.message : ""}
        >
          {type === "password" ? (
            <Input.Password
              {...field}
              type={type}
              id={name}
              size={size}
              placeholder={placeholder}
              className={`h-9 ${className}`}
            />
          ) : type === "number" ? (
            <InputNumber
              {...field}
              type={type}
              id={name}
              size={size}
              placeholder={placeholder}
              disabled={disabled}
              className={`h-9 !w-full ${className || ""}`}
              suffix={suffix}
              style={style}
              max={max}
            />
          ) : (
            <Input
              {...field}
              type={type}
              id={name}
              size={size}
              placeholder={placeholder}
              disabled={disabled}
              className={`h-9 ${className || ""}`}
              suffix={suffix}
              style={style}
              max={max}
              dir={dir}
            />
          )}
        </Form.Item>
      )}
    />
  );
};

export default UInput;
