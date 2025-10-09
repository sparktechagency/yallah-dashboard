"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import UUpload from "@/components/Form/UUpload";
import { useCreateCategoriesMutation } from "@/redux/api/categoriesApi";
import { Button, Modal } from "antd";
import toast from "react-hot-toast";

export default function CreateCategoryModal({ open, setOpen }) {
  // add categories api call
  const [addCategory, { isLoading }] = useCreateCategoriesMutation();
  const handleSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("payload", JSON.stringify(data));
      if (data.image && data.image[0]?.originFileObj) {
        formData.append("image", data.image[0].originFileObj);
      }
      const res = await addCategory(formData).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Category added successfully");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add category");
    }
  };
  return (
    <Modal
      centered
      open={open}
      setOpen={setOpen}
      footer={null}
      onCancel={() => {
        setOpen(false);
      }}
      title="Create Category"
    >
      <FormWrapper onSubmit={handleSubmit}>
        <UUpload
          type="file"
          name="image"
          label="Category Image"
          required={true}
        />
        <UInput
          type="text"
          name="name"
          label="Category Name"
          required={true}
          placeholder="Enter category name"
        />

        <Button
          style={{
            background: "linear-gradient(80deg, #FF9D53 0%, #CD5EA7 100%)",
          }}
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
