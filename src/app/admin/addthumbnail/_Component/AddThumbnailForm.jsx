"use client";
import { Button, Divider, Form, Modal } from "antd";

import { RiCloseLargeLine } from "react-icons/ri";

import { useGetCouponsByStoreIdQuery } from "@/redux/api/couponApi";
import { useState } from "react";
import toast from "react-hot-toast";
import UUpload from "@/components/Form/UUpload";
import FormWrapper from "@/components/Form/FormWrapper";
import USelect from "@/components/Form/USelect";
import { useAddthumbnailsMutation } from "@/redux/api/thumbnailApi";
import { useGetAllStoresQuery } from "@/redux/api/storeApi";

const AddThumbnailModal = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);

  // ================= Store API =================
  const { data: storeData, isLoading: storeLoading } = useGetAllStoresQuery({
    limit: 1000000000,
    page: 1,
    searchText,
  });
  // ================= Coupon API (Dependent) =================
  const { data: couponData, isLoading: couponLoading } =
    useGetCouponsByStoreIdQuery(
      {
        limit: 100,
        page: 1,
        searchText,
        storeId: selectedStore,
      },
      {
        skip: !selectedStore, // 🔒 skip until store selected
      },
    );

  // ----------------add banner api call---------------
  const [addThumbnail, { isLoading: isaddThumbnailLoading }] =
    useAddthumbnailsMutation();

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("payload", JSON.stringify(values));
      if (values.thumbnail?.length > 0 && values.thumbnail[0]?.originFileObj) {
        formData.append("image", values.thumbnail[0].originFileObj);
      } else {
        console.error("No valid image file found");
        toast.error("Please upload a valid image");
        return;
      }
      const res = await addThumbnail(formData).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Banner added successfully");
        form.resetFields();
        setOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.data?.message || "Failed to add banner");
    }
  };
  const onSearch = (value) => {
    setSearchText(value);
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
      width={800}
      loading={couponLoading}
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
        <h4 className="text-center text-2xl font-medium">Add Thumnail</h4>
        <Divider />
        <div className="flex-1">
          <FormWrapper form={form} onSubmit={handleSubmit}>
            <UUpload
              name="thumbnail"
              label="Thumbnail"
              placeholder={"Upload Thumbnail"}
              required={true}
            />

            {/* Store Select */}
            <USelect
              name="store"
              label="Store"
              placeholder="Select Store"
              loading={storeLoading}
              options={storeData?.data?.data?.map((item) => ({
                label: item.name,
                value: item._id,
              }))}
              showSearch
              optionFilterProp="children"
              onSearch={onSearch}
              onChange={(value) => {
                setSelectedStore(value); // ✅ storeId set
                form.setFieldsValue({ coupon: null }); // ✅ reset coupon
              }}
            />

            {/* Coupon Select (Dependent) */}
            <USelect
              name="coupon"
              label="Coupon"
              placeholder={
                selectedStore ? "Select Coupon" : "Select Store First"
              }
              loading={couponLoading}
              disabled={!selectedStore} // 🔒 disabled until store selected
              options={couponData?.data?.data?.map((item) => ({
                label: item.title,
                value: item._id,
              }))}
              showSearch
              optionFilterProp="children"
              onSearch={onSearch}
            />

            {/* Hint */}
            {!selectedStore && (
              <p className="mt-1 text-xs text-gray-400">
                Please select a store to load coupons
              </p>
            )}
            <Button
              htmlType="submit"
              className="w-full"
              size="large"
              type="primary"
              style={{
                background: "linear-gradient(80deg, #FF9D53 0%, #CD5EA7 100%)",
              }}
              loading={isaddThumbnailLoading}
            >
              Save
            </Button>
          </FormWrapper>
        </div>
      </div>
    </Modal>
  );
};

export default AddThumbnailModal;
