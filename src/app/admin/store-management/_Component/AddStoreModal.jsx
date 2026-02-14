"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import USelect from "@/components/Form/USelect";
import UUpload from "@/components/Form/UUpload";
import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";
import { useAddStoreMutation } from "@/redux/api/storeApi";
import { Button, Divider, Form, Modal } from "antd";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { RiCloseLargeLine } from "react-icons/ri";

const AddStoreModal = ({ open, setOpen }) => {
  const [categoriesearchText, setCategoriesearchText] = useState("");
  const [form] = Form.useForm();

  const [createStore, { isLoading }] = useAddStoreMutation();

  const { data: categoriesData } = useGetCategoriesQuery({
    limit: 1000,
    page: 1,
    searchText: categoriesearchText,
  });

  // Stable default values for react-hook-form
  const defaultValues = useMemo(
    () => ({
      name: "",
      arabicName: "",
      categories: [],
      isFeatured: false,
      image: [],
      thumbnail: [],
      arabicThumbnail: [],
    }),
    [],
  );

  const handleSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("payload", JSON.stringify(data));

      if (data.image?.[0]?.originFileObj)
        formData.append("image", data.image[0].originFileObj);
      if (data.thumbnail?.[0]?.originFileObj)
        formData.append("thumbnail", data.thumbnail[0].originFileObj);
      if (data.arabicThumbnail?.[0]?.originFileObj)
        formData.append(
          "arabicThumbnail",
          data.arabicThumbnail[0].originFileObj,
        );

      const res = await createStore(formData).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Store added successfully");
        form.resetFields();
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add store");
    }
  };

  const handleClose = () => {
    form.resetFields(); // ✅ Reset manually when closing
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered
      onCancel={handleClose}
      closeIcon={false}
      width={900}
      destroyOnClose={false} // Keep form instance alive
    >
      <div
        className="absolute right-0 top-0 h-12 w-12 cursor-pointer rounded-bl-3xl"
        onClick={handleClose}
      >
        <RiCloseLargeLine
          size={18}
          color="black"
          className="absolute left-1/3 top-1/3"
        />
      </div>

      <div className="pb-5">
        <h4 className="text-center text-2xl font-medium">Add Store</h4>
        <Divider />

        <FormWrapper
          form={form}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
        >
          <UUpload name="image" label="Store Logo" required />
          <p className="my-4 text-xs text-gray-500">
            Format: PNG / JPG | 512×512px | Max: 2MB
          </p>

          <UUpload name="thumbnail" label="Store Thumbnail" required />
          <p className="my-4 text-xs text-gray-500">
            Format: JPG / PNG | 800×600px | 4:3 | Max: 2MB
          </p>

          <UUpload name="arabicThumbnail" label="صورة مصغرة للمتجر" required />
          <p className="my-4 text-xs text-gray-500">
            Format: JPG / PNG | 800×600px | 4:3 | Max: 2MB
          </p>

          <USelect
            mode="multiple"
            name="categories"
            label="Category Name"
            required
            placeholder="Select category"
            options={categoriesData?.data?.data?.map((item) => ({
              label: item?.name,
              value: item?._id,
            }))}
            showSearch
            onSearch={(value) => setCategoriesearchText(value)}
          />

          <UInput
            name="name"
            label="Store Name"
            required
            placeholder="Enter store name"
          />
          <UInput
            name="arabicName"
            label="اسم المتجر"
            required
            placeholder="أدخل اسم المتجر"
            dir="rtl"
          />

          <USelect
            name="isFeatured"
            label="Featured Status"
            required
            placeholder="Select status"
            options={[
              { label: "Featured", value: true },
              { label: "Not Featured", value: false },
            ]}
          />

          <Button
            htmlType="submit"
            className="w-full"
            size="large"
            type="primary"
            loading={isLoading}
            style={{
              background: "linear-gradient(80deg, #FF9D53 0%, #CD5EA7 100%)",
            }}
          >
            Submit
          </Button>
        </FormWrapper>
      </div>
    </Modal>
  );
};

export default AddStoreModal;
