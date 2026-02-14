import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import USelect from "@/components/Form/USelect";
import UTextArea from "@/components/Form/UTextArea";
import {
  useGetAllCouponsQuery,
  useGetCouponByIdQuery,
  useGetCouponsByStoreIdQuery,
} from "@/redux/api/couponApi";
import { useSendPushNotificationMutation } from "@/redux/api/pushnotificationApi";
import { useGetAllStoresQuery } from "@/redux/api/storeApi";
import { Button, Modal } from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";
import countries from "world-countries";

const PushNotificationModal = ({ open, setOpen }) => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [couponId, setCouponId] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);

  // ================= Store API =================
  const { data: storeData, isLoading: storeLoading } = useGetAllStoresQuery({
    limit: 1000000000,
    page: 1,
    searchText,
  });

  // ================= Coupon API (Dependent) =================
  const { data: coupons, isLoading: couponsLoading } =
    useGetCouponsByStoreIdQuery(
      {
        limit: 1000000000,
        page: 1,
        searchText,
        storeId: selectedStore,
      },
      {
        skip: !selectedStore, // 🔒 skip until store selected
      },
    );

  // Get single coupon details with refetch on arg change
  const {
    data: singleCoupon,
    isLoading: singleCouponLoading,
    refetch: refetchSingleCoupon,
  } = useGetCouponByIdQuery(couponId, {
    skip: !couponId,
    refetchOnMountOrArgChange: true, // 🔹 Ensure API hits on every change
  });
  const onSearch = (value) => {
    setSearchText(value);
  };

  // add push notification
  const [addPushNotification, { isLoading }] =
    useSendPushNotificationMutation();

  const couponOptions = coupons?.data?.data?.map((item) => ({
    label: item?.title,
    value: item?._id,
  }));

  const handleSubmit = async (data, { reset }) => {
    try {
      const res = await addPushNotification(data).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Notification sent successfully");
        reset(); // Reset the form fields
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send notification");
    }
  };

  const countryMap = countries.reduce((acc, c) => {
    acc[c.cca2] = c.name.common;
    return acc;
  }, {});

  return (
    <div>
      <Modal
        centered
        open={open}
        onCancel={() => setOpen(false)}
        width={800}
        footer={null}
        title="Push Notification"
        loading={couponsLoading}
      >
        <FormWrapper onSubmit={handleSubmit}>
          <UInput
            type="text"
            name="title"
            label="Notification Title"
            required={true}
            placeholder="Enter title"
          />
          <UInput
            type="text"
            name="arabicTitle"
            label="العنوان (Arabic)"
            required={true}
            placeholder="أدخل العنوان"
            dir="rtl"
          />
          <UTextArea
            type="text"
            name="body"
            label="Notification Description"
            required={true}
            placeholder="Enter description"
          />
          <UTextArea
            type="text"
            name="arabicBody"
            label="الوصف (Arabic)"
            required={true}
            placeholder="أدخل الوصف"
            dir="rtl"
          />
          <h1 className="text-center text-lg font-bold">Targeting Filters</h1>

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
          <USelect
            label="Coupon"
            name="coupon"
            required={true}
            placeholder="Select Coupon"
            options={couponOptions}
            onChange={(value) => {
              setCouponId(value);
              refetchSingleCoupon();
            }}
          />

          <USelect
            label="Country"
            name="countries"
            mode="multiple"
            placeholder="Select Country"
            required
            disabled={singleCouponLoading}
            options={
              singleCoupon?.data?.countries?.map((code) => ({
                label: countryMap[code] || code,
                value: code,
              })) || []
            }
          />

          <Button
            loading={isLoading}
            style={{
              width: "100%",
              background: "linear-gradient(120deg, #CD5EA7 0%, #FF9D53 90%)",
            }}
            type="primary"
            htmlType="submit"
          >
            Send Notification
          </Button>
        </FormWrapper>
      </Modal>
    </div>
  );
};

export default PushNotificationModal;
