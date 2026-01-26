import React from "react";
import { Button, Form, Input, Modal, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useUpdateCategoryMutation } from "@/redux/api/categoriesApi";
import toast from "react-hot-toast";
import UInput from "@/components/Form/UInput";

export default function EditCategoryModal({ open, setOpen, selectedCategory }) {
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      // 👇 text payload only
      const payload = {
        name: values.name,
        arabicName: values.arabicName,
      };
      formData.append("payload", JSON.stringify(payload));

      // 👇 English banner (only if changed)
      if (values.banner?.[0]?.originFileObj) {
        formData.append("image", values.banner[0].originFileObj);
      }

      // 👇 Arabic banner (only if changed)
      if (values.arabicBanner?.[0]?.originFileObj) {
        formData.append("arabicImage", values.arabicBanner[0].originFileObj);
      }

      const res = await updateCategory({
        id: selectedCategory?.id,
        formData,
      }).unwrap();

      if (res?.success) {
        toast.success(res.message || "Category updated successfully");
        setOpen(false);
        form.resetFields();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update category");
    }
  };

  const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

  return (
    <Modal
      centered
      open={open}
      footer={null}
      onCancel={() => setOpen(false)}
      title="Edit Category"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: selectedCategory?.name,
          arabicName: selectedCategory?.arabicName,

          banner: selectedCategory?.image
            ? [
                {
                  uid: "-1",
                  name: "banner",
                  status: "done",
                  url: selectedCategory.image,
                },
              ]
            : [],

          arabicBanner: selectedCategory?.arabicImage
            ? [
                {
                  uid: "-1",
                  name: "arabicBanner",
                  status: "done",
                  url: selectedCategory.arabicImage,
                },
              ]
            : [],
        }}
      >
        {/* English Banner */}
        <Form.Item
          name="banner"
          label="Banner Image (English)"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Please upload banner image" }]}
        >
          <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Upload Banner</Button>
          </Upload>
        </Form.Item>

        {/* Arabic Banner */}
        <Form.Item
          name="arabicBanner"
          label="Banner Image (Arabic)"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Please upload banner image" }]}
        >
          <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Upload Banner</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: "Enter category name" }]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>

        <Form.Item
          name="arabicName"
          label="Category Name (Arabic)"
          rules={[{ required: true, message: "Enter Arabic name" }]}
        >
          <Input placeholder="أدخل اسم الفئة" />
        </Form.Item>

        <Button
          htmlType="submit"
          type="primary"
          size="large"
          className="w-full"
          loading={isLoading}
          style={{
            background: "linear-gradient(80deg, #FF9D53 0%, #CD5EA7 100%)",
          }}
        >
          Save
        </Button>
      </Form>
    </Modal>
  );
}
