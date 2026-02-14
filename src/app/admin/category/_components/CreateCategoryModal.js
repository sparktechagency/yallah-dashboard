"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import UUpload from "@/components/Form/UUpload";
import { useCreateCategoriesMutation } from "@/redux/api/categoriesApi";
import { Button, Modal, Form } from "antd";
import toast from "react-hot-toast";

export default function CreateCategoryModal({ open, setOpen }) {
  const [form] = Form.useForm();
  const [addCategory, { isLoading }] = useCreateCategoriesMutation();

  const handleSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("payload", JSON.stringify(data));

      if (data.image?.[0]?.originFileObj) {
        formData.append("image", data.image[0].originFileObj);
      }
      if (data.arabicImage?.[0]?.originFileObj) {
        formData.append("arabicImage", data.arabicImage[0].originFileObj);
      }

      const res = await addCategory(formData).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Category added successfully");

        // ✅ Reset the entire form including file uploads
        form.resetFields({
          image: [],         // Clear image upload
          arabicImage: [],   // Clear Arabic image upload
          name: "",          // Clear text fields if desired
          arabicName: "",
        });

        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add category");
      // ❌ Do NOT reset the form on error
    }
  };

  const handleClose = () => {
    form.resetFields({
      image: [],
      arabicImage: [],
      name: "",
      arabicName: "",
    });
    setOpen(false);
  };

  return (
    <Modal
      centered
      open={open}
      footer={null}
      onCancel={handleClose}
      closeIcon={false}
      destroyOnClose={false}
      title="Create Category"
    >
      <FormWrapper form={form} onSubmit={handleSubmit}>
        <UUpload type="file" name="image" label="Category" required />
        <p className="my-4 text-xs text-gray-500">
          Format: PNG / JPG | Size: 256×256px | Square image | Max: 1MB
        </p>

        <UUpload type="file" name="arabicImage" label="صورة الفئة" required dir="rtl" />
        <p className="my-4 text-xs text-gray-500">
          Format: PNG / JPG | Size: 256×256px | Square image | Max: 1MB
        </p>

        <UInput
          type="text"
          name="name"
          label="Category Name (English)"
          required
          placeholder="Enter category name"
        />
        <UInput
          type="text"
          name="arabicName"
          label="اسم الفئة"
          required
          placeholder="أدخل اسم الفئة"
          dir="rtl"
        />

        <Button
          style={{ background: "linear-gradient(80deg, #FF9D53 0%, #CD5EA7 100%)" }}
          type="primary"
          size="large"
          className="w-full"
          htmlType="submit"
          loading={isLoading}
        >
          Submit
        </Button>
      </FormWrapper>
    </Modal>
  );
}
