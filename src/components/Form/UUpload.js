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

        // Use length + some stable value as key → forces full remount when empty
        const uploadKey =
          fileList.length > 0
            ? `upload-${name}-${fileList.length}`
            : `upload-${name}-empty`;

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
              key={uploadKey}
              name={name}
              listType="picture"
              maxCount={1}
              fileList={field.value || []}
              onChange={({ fileList }) => field.onChange(fileList)} // Update react-hook-form state
              defaultFileList={defaultFileList} // Set default file list for Upload component
              beforeUpload={(file) => {
                let isValidFileType = false;

                if (fileType === "image") {
                  isValidFileType = file.type.startsWith("image/");
                } else if (fileType === "ical") {
                  isValidFileType =
                    file.type === "text/calendar" || file.name.endsWith(".ics");
                }

                if (!isValidFileType) {
                  toast.error(
                    `Invalid file type!! Only ${fileType} files are allowed.`,
                  );
                  return Upload.LIST_IGNORE;
                }

                return false; // prevent automatic upload
              }}
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
