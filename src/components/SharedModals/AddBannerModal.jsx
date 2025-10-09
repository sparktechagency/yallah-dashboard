"use client";
import { Button, Divider, Form, Modal } from "antd";

import { RiCloseLargeLine } from "react-icons/ri";
import FormWrapper from "../Form/FormWrapper";
import UUpload from "../Form/UUpload";
import UInput from "../Form/UInput";
import USelect from "../Form/USelect";
import { useGetAllCouponsQuery } from "@/redux/api/couponApi";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAddBannerMutation } from "@/redux/api/bannerApi";

const AddbannerModal = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  // --------------get cupon api call--------------------------------
  const { data, isLoading } = useGetAllCouponsQuery({
    limit: 100,
    page: 1,
    searchText: searchText,
  });

  // ----------------add banner api call---------------
  const [addBanner, { isLoading: isBannerLoading }] = useAddBannerMutation();

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("payload", JSON.stringify(values));
      if (values.banner?.length > 0 && values.banner[0]?.originFileObj) {
        console.log("Appending image:", values.banner[0].originFileObj);
        formData.append("image", values.banner[0].originFileObj);
      } else {
        console.error("No valid image file found");
        toast.error("Please upload a valid image");
        return;
      }
      const res = await addBanner(formData).unwrap();
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
      loading={isLoading}
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
        <h4 className="text-center text-2xl font-medium">Add Banner</h4>
        <Divider />
        <div className="flex-1">
          <FormWrapper form={form} onSubmit={handleSubmit}>
            <UUpload
              name="banner"
              label="Banner"
              placeholder={"Upload Banner"}
              required={true}
            />
            <UInput
              name="title"
              label="Title"
              required={true}
              placeholder={"Enter Title"}
            />
            <UInput
              name="subTitle"
              label="Sub-Title"
              required={true}
              placeholder={"Enter Sub-Title"}
            />
            <USelect
              name="coupon"
              label="Coupon"
              placeholder={"Select Coupon"}
              options={data?.data?.data?.map((item) => ({
                label: item.title,
                value: item._id,
              }))}
              showSearch
              optionFilterProp="children"
              onSearch={onSearch}
            />
            <Button
              htmlType="submit"
              className="w-full"
              size="large"
              type="primary"
              style={{
                background: "linear-gradient(80deg, #FF9D53 0%, #CD5EA7 100%)",
              }}
              loading={isBannerLoading}
            >
              Save
            </Button>
          </FormWrapper>
        </div>
      </div>
    </Modal>
  );
};

export default AddbannerModal;
