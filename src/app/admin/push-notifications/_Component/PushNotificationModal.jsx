import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import USelect from "@/components/Form/USelect";
import UTextArea from "@/components/Form/UTextArea";
import {
  useGetAllCouponsQuery,
  useGetCouponByIdQuery,
} from "@/redux/api/couponApi";
import { useSendPushNotificationMutation } from "@/redux/api/pushnotificationApi";
import { Button, Modal } from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";

const PushNotificationModal = ({ open, setOpen }) => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [couponId, setCouponId] = useState("");

  // Get all coupons
  const { data: coupons, isLoading: couponsLoading } = useGetAllCouponsQuery({
    limit: 100,
    page: currentPage,
    searchText,
  });

  // Get single coupon details with refetch on arg change
  const {
    data: singleCoupon,
    isLoading: singleCouponLoading,
    refetch: refetchSingleCoupon,
  } = useGetCouponByIdQuery(couponId, {
    skip: !couponId,
    refetchOnMountOrArgChange: true, // 🔹 Ensure API hits on every change
  });

  // add push notification
  const [addPushNotification, { isLoading }] =
    useSendPushNotificationMutation();

  const couponOptions = coupons?.data?.data?.map((item) => ({
    label: item?.title,
    value: item?._id,
  }));

  const handleSubmit = async (data) => {
    try {
      const res = await addPushNotification(data).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Notification sent successfully");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send notification");
    }
  };

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
          <UTextArea
            type="text"
            name="body"
            label="Notification Description"
            required={true}
            placeholder="Enter description"
          />
          <h1 className="text-center text-lg font-bold">Targeting Filters</h1>

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
            label="Region"
            name="countries"
            mode={"multiple"}
            placeholder={"Select Region"}
            required={true}
            options={
              singleCoupon?.data?.countries?.map((item) => ({
                label: item,
                value: item,
              })) || []
            }
            desabled={singleCouponLoading}
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
