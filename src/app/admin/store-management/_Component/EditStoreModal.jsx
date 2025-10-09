"use client";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import USelect from "@/components/Form/USelect";
import UUpload from "@/components/Form/UUpload";
import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";
import { useUpdateStoreMutation } from "@/redux/api/storeApi";
import { Button, Divider, Form, Modal } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiCloseLargeLine } from "react-icons/ri";

const EditStoreModal = ({ open, setOpen, setStoreId }) => {
  const [storeData, setStoreData] = useState({});
  const [categoriesearchText, setCategoriesearchText] = useState("");

  // Fetch the store data when the storeId is available
  useEffect(() => {
    if (setStoreId) {
      // Fetch store data using setStoreId (this can be an API call in a real scenario)
      setStoreData(setStoreId); // Assuming setStoreId holds the store data
    }
  }, [setStoreId]);

  // update store API call
  const [updateStore, { isLoading }] = useUpdateStoreMutation();

  const handleSubmit = async (values) => {
    if (!storeData?.id) {
      toast.error("Store ID is missing.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("payload", JSON.stringify(values));

      if (values.image && values.image[0]?.originFileObj) {
        formData.append("image", values.image[0].originFileObj);
      }

      if (values.thumbnail && values.thumbnail[0]?.originFileObj) {
        formData.append("thumbnail", values.thumbnail[0].originFileObj);
      }

      const res = await updateStore({ id: storeData.id, formData }).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Store updated successfully");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update store");
    }
  };

  // Fetch categories data from API
  const { data: categoriesData } = useGetCategoriesQuery({
    limit: 1000,
    page: 1,
    searchText: categoriesearchText,
  });

  // Show loading message if categories data is not available yet
  if (!categoriesData?.data?.data) {
    return <div>Loading categories...</div>;
  }

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
      width={800}
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
        <h4 className="text-center text-2xl font-medium">Edit Store</h4>
        <Divider />
        <div className="flex-1">
          <FormWrapper
            defaultValues={{
              name: storeData?.name,
              categories: storeData?.categories?.map((item) => item),
            }}
            onSubmit={handleSubmit}
          >
            <UUpload
              name="image"
              label="Store Logo"
              placeholder={"Upload Store Logo"}
              required={false}
              defaultFileList={[
                {
                  uid: "-1",
                  name: "image_logo",
                  status: "done",
                  url: storeData?.img,
                },
              ]}
            />
            <UUpload
              name="thumbnail"
              label="Store Thumbnail"
              required={false}
              placeholder={"Upload Store Thumbnail"}
              defaultFileList={[
                {
                  uid: "-1",
                  name: "image_thumbnail",
                  status: "done",
                  url: storeData?.thumbnail,
                },
              ]}
            />
            <UInput
              name="name"
              label="Store Name"
              required={true}
              placeholder={"Enter Store Name"}
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
            <Button
              htmlType="submit"
              className="w-full"
              size="large"
              type="primary"
              style={{
                background: "linear-gradient(80deg, #FF9D53 0%, #CD5EA7 100%)",
              }}
              loading={isLoading}
            >
              Submit
            </Button>
          </FormWrapper>
        </div>
      </div>
    </Modal>
  );
};

export default EditStoreModal;
