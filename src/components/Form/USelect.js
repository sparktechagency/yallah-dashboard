import { Select } from "antd";
import { Form } from "antd";
import { Controller } from "react-hook-form";

const USelect = ({
  name,
  label,
  placeholder,
  options,
  size,
  defaultValue,
  showSearch,
  mode,
  filterOption,
  style,
  labelStyles = {},
  onChange,
}) => {
  return (
    <Controller
      name={name}
      render={({
        field: { onChange: fieldOnChange, value: fieldValue },
        fieldState: { error },
      }) => (
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
          <Select
            mode={mode}
            filterOption={filterOption}
            showSearch={showSearch}
            value={fieldValue || defaultValue}
            size={size}
            options={options}
            placeholder={placeholder}
            style={{ ...style, height: style?.height || "35px" }}
            onChange={(value) => {
              fieldOnChange(value);
              onChange?.(value);
            }}
          />
        </Form.Item>
      )}
    />
  );
};

export default USelect;
