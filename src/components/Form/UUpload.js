import { Button, Upload, Form } from "antd";
import { UploadCloud } from "lucide-react";
import { Controller } from "react-hook-form";

export default function UUpload({
  type,
  name,
  label,
  size,
  placeholder,
  defaultFileList = [],
  disabled = false,
  labelStyles = {},
  className,
  suffix,
  style,
  max,
  required,
}) {
  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => {
        // Initialize fileList with defaultFileList if field.value is undefined
        const fileList = field.value || defaultFileList;

        return (
          <Form.Item
            name={name}
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              console.log("getValueFromEvent:", e);
              if (Array.isArray(e)) return e;
              return e && e.fileList;
            }}
            // rules={[
            //   {
            //     required,
            //     message: `Please upload ${label}`,
            //     validator: (_, value) => {
            //       console.log("Validation value:", value);
            //       if (
            //         !value ||
            //         value.length === 0 ||
            //         (!value[0]?.originFileObj && !value[0]?.url)
            //       ) {
            //         return Promise.reject(new Error(`Please upload ${label}`));
            //       }
            //       return Promise.resolve();
            //     },
            //   },
            // ]}
            style={{
              textAlign: "center",
              border: "2px dashed #D9D9D9",
              paddingBlock: "30px",
              borderRadius: "10px",
            }}
          >
            <Upload
              name={name}
              listType="picture"
              maxCount={1}
              beforeUpload={() => false} // Prevent automatic upload
              fileList={fileList} // Use fileList from Controller or defaultFileList
              onChange={({ fileList }) => field.onChange(fileList)} // Update react-hook-form state
              defaultFileList={defaultFileList} // Set default file list for Upload component
            >
              <Button icon={<UploadCloud />}>Upload {label} Image</Button>
            </Upload>
            {error && <div style={{ color: "red" }}>{error.message}</div>}
          </Form.Item>
        );
      }}
    />
  );
}
