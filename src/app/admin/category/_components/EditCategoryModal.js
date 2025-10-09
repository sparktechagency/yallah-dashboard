import React from "react";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { Button, Modal } from "antd";
import { useUpdateCategoryMutation } from "@/redux/api/categoriesApi";
import toast from "react-hot-toast";

export default function EditCategoryModal({ open, setOpen, selectedCategory }) {
  // update category
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();
  const handleSubmit = async (data) => {
    try {
      const res = await updateCategory({
        id: selectedCategory.id,
        data,
      }).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Category updated successfully");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update category");
    }
  };
  return (
    <Modal
      centered
      open={open}
      footer={null}
      onCancel={() => setOpen(false)}
      title="Edit Category"
    >
      <FormWrapper
        onSubmit={handleSubmit}
        defaultValues={{
          name: selectedCategory?.name,
        }}
      >
        <UInput
          type="text"
          name="name"
          label="Category Name"
          required={true}
          size="large"
          placeholder="Enter category name"
        />

        <Button
          style={{
            background: "linear-gradient(80deg, #FF9D53 0%, #CD5EA7 100%)",
          }}
          type="primary"
          size="large"
          className="w-full"
          loading={isLoading}
          htmlType="submit"
        >
          Submit
        </Button>
      </FormWrapper>
    </Modal>
  );
}
