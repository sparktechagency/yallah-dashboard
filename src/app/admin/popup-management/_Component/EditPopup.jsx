"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal, Button, Divider, Form, Upload } from "antd";
import { RiCloseLargeLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { UploadOutlined } from "@ant-design/icons";
import FormWrapper from "@/components/Form/FormWrapper";
import USelect from "@/components/Form/USelect";

import { useGetAllStoresQuery } from "@/redux/api/storeApi";
import { useGetCouponsByStoreIdQuery } from "@/redux/api/couponApi";
import { useUpdatePopUpMutation } from "@/redux/api/popupAPi";
import UInput from "@/components/Form/UInput";
import countries from "world-countries";

const EditPopUpModal = ({ open, setOpen, selectedBanner }) => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [uploadedThumbnail, setUploadedThumbnail] = useState([]);
  const [uploadedArabicThumbnail, setUploadedArabicThumbnail] = useState([]);

  useEffect(() => {
    if (selectedBanner?.image) {
      setUploadedThumbnail([
        {
          uid: "-1",
          name: "thumbnail.png",
          status: "done",
          url: selectedBanner?.image,
        },
      ]);
    }

    if (selectedBanner?.arabicImage) {
      setUploadedArabicThumbnail([
        {
          uid: "-2",
          name: "arabic-thumbnail.png",
          status: "done",
          url: selectedBanner?.arabicImage,
        },
      ]);
    }
  }, [selectedBanner]);
  // ================= Store API =================
  const { data: storeData, isLoading: storeLoading } = useGetAllStoresQuery({
    limit: 1000000,
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
      { skip: !selectedStore },
    );

  const countryOptions = useMemo(() => {
    return countries.map((c) => ({
      label: c.name.common, // Full country name (Bangladesh, United States, etc.)
      value: c.cca2, // ISO code (BD, US)
    }));
  }, []);

  // ---------------- edit Thumbnail API ----------------
  const [updateThumbnail, { isLoading }] = useUpdatePopUpMutation();

  // ---------------- Handle Submit ----------------
  const handleSubmit = async (values, { reset }) => {
    try {
      const formData = new FormData();
      formData.append("payload", JSON.stringify(values));

      if (
        uploadedThumbnail?.length > 0 &&
        uploadedThumbnail[0]?.originFileObj
      ) {
        formData.append("image", uploadedThumbnail[0].originFileObj);
      }
      if (
        uploadedArabicThumbnail?.length > 0 &&
        uploadedArabicThumbnail[0]?.originFileObj
      ) {
        formData.append(
          "arabicImage",
          uploadedArabicThumbnail[0].originFileObj,
        );
      }

      const res = await updateThumbnail({
        id: selectedBanner._id,
        formData,
      }).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Pop Up updated successfully");
        form.resetFields();
        setUploadedThumbnail([]);
        setUploadedArabicThumbnail([]);
        setSelectedStore(null);
        setOpen(false);
        reset();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.data?.message || "Failed to update Pop Up");
    }
  };

  const handleSearch = (value) => setSearchText(value);

  return (
    <Modal
      open={open}
      footer={null}
      centered
      onCancel={() => setOpen(false)}
      closeIcon={false}
      width={800}
      style={{ minWidth: "max-content", position: "relative" }}
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
        <h4 className="text-center text-2xl font-medium">
          Add Pop UP Thumbnail
        </h4>
        <Divider />

        <FormWrapper
          form={form}
          onSubmit={handleSubmit}
          defaultValues={{
            title: selectedBanner?.title,
            arabicTitle: selectedBanner?.arabicTitle,
            store: selectedBanner?.coupon?.store?._id,
            coupon: selectedBanner?.coupon?._id,
            countries: selectedBanner?.countries,
            status: selectedBanner?.status,
          }}
        >
          <UInput
            name="title"
            label="Title"
            placeholder="Enter Title"
            required
          />
          <UInput
            name="arabicTitle"
            label="العنوان (Arabic)"
            placeholder="أدخل العنوان"
            dir="rtl"
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
            onSearch={handleSearch}
            onChange={(value) => {
              setSelectedStore(value);
              form.setFieldsValue({ coupon: null });
            }}
          />

          <div className="mb-6 rounded-lg border-2 border-dashed p-6">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              listType="picture"
              fileList={uploadedThumbnail}
              onChange={({ fileList }) => setUploadedThumbnail(fileList)}
            >
              <div className="flex w-full min-w-[816px] justify-center">
                <Button icon={<UploadOutlined />} className="mx-auto">
                  Upload English Thumbnail
                </Button>
              </div>
            </Upload>
          </div>
          <p className="!my-4 text-xs text-gray-500">
            Image format: JPG / PNG | Recommended size: 1200×675px | Max size:
            2MB
          </p>

          <div className="mb-6 rounded-lg border-2 border-dashed p-6">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              listType="picture"
              fileList={uploadedArabicThumbnail}
              onChange={({ fileList }) => setUploadedArabicThumbnail(fileList)}
            >
              <div className="flex w-full min-w-[816px] justify-center">
                <Button icon={<UploadOutlined />} className="mx-auto">
                  قم برفع الصورة المصغرة
                </Button>
              </div>
            </Upload>
          </div>
          <p className="!my-4 text-xs text-gray-500">
            Image format: JPG / PNG | Recommended size: 1200×675px | Max size:
            2MB
          </p>

          {/* Coupon Select */}
          <USelect
            name="coupon"
            label="Coupon"
            placeholder={selectedStore ? "Select Coupon" : "Select Store First"}
            disabled={!selectedStore}
            loading={couponLoading}
            options={couponData?.data?.data?.map((item) => ({
              label: item?.title,
              value: item._id,
            }))}
            showSearch
            optionFilterProp="children"
            onSearch={handleSearch}
            defaultValue={{
              label: selectedBanner?.coupon?.title,
              value: selectedBanner?.coupon?._id,
            }}
          />

          {!selectedStore && (
            <p className="mt-1 text-xs text-gray-400">
              Please select a store to load coupons
            </p>
          )}

          {/* Countries */}
          <USelect
            name="countries"
            mode="multiple"
            label="Country Name"
            placeholder="Select country"
            options={countryOptions}
            showSearch
            optionFilterProp="label"
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
          />
          <USelect
            type="text"
            name="status"
            label="Status"
            required={true}
            placeholder="Select status"
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />
          <Button
            htmlType="submit"
            className="mt-4 w-full"
            size="large"
            type="primary"
            loading={isLoading}
            style={{
              background: "linear-gradient(80deg, #FF9D53 0%, #CD5EA7 100%)",
            }}
          >
            Save
          </Button>
        </FormWrapper>
      </div>
    </Modal>
  );
};

export default EditPopUpModal;
