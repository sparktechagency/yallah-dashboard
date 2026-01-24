"use client";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import USelect from "@/components/Form/USelect";
import UUpload from "@/components/Form/UUpload";
import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";
import { useAddStoreMutation } from "@/redux/api/storeApi";
import { Button, Divider, Form, Modal } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";

import { RiCloseLargeLine } from "react-icons/ri";

const AddStoreModal = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [categoriesearchText, setCategoriesearchText] = useState("");
  // create new store api call

  const [createStore, { isLoading }] = useAddStoreMutation();

  // get all categories from api
  // get all categories api call
  const { data: categoriesData } = useGetCategoriesQuery({
    limit: 1000,
    page: 1,
    searchText: categoriesearchText,
  });

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("payload", JSON.stringify(values));
      formData.append("image", values.image[0].originFileObj);
      formData.append("thumbnail", values.thumbnail[0].originFileObj);
      formData.append("arabicImage", values.arabicImage[0].originFileObj);
      formData.append(
        "arabicThumbnail",
        values.arabicThumbnail[0].originFileObj,
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

  return (
    <Modal
      open={open}
      footer={null}
      centered
      onCancel={() => setOpen(false)}
      closeIcon={false}
      style={{
        minWidth: "max-content",
        position: "relative",
      }}
      width={900}
    >
      {/* Close Icon */}
      <div
        className="absolute right-0 top-0 h-12 w-12 cursor-pointer rounded-bl-3xl"
        onClick={() => setOpen(false)}
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
        <div className="flex-1">
          <FormWrapper onSubmit={handleSubmit}>
            <UUpload
              name="image"
              label="Store Logo"
              placeholder={"Upload Store Logo"}
              required={true}
            />
            <UUpload
              name="arabicImage"
              label="شعار المتجر"
              placeholder="قم برفع شعار المتجر"
              required={true}
            />

            <UUpload
              name="thumbnail"
              label="Store Thumbnail"
              placeholder={"Upload Store Thumbnail"}
              required={true}
            />
            <UUpload
              name="arabicThumbnail"
              label="صورة مصغرة للمتجر"
              placeholder="قم برفع الصورة المصغرة للمتجر"
              required={true}
            />
            <USelect
              type="text"
              mode="multiple"
              name="categories"
              label="Category Name"
              required={true}
              placeholder="Enter category name"
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
              required={true}
              placeholder={"Enter Store Name"}
            />
            <UInput
              name="arabicName"
              label="اسم المتجر"
              required={true}
              placeholder="أدخل اسم المتجر"
              dir="rtl"
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
      </div>
    </Modal>
  );
};

export default AddStoreModal;
