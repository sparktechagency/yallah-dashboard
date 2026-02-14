"use client";
import { Button, Divider, Form, Modal, Upload } from "antd";
import { RiCloseLargeLine } from "react-icons/ri";
import { useState } from "react";
import toast from "react-hot-toast";
import FormWrapper from "../Form/FormWrapper";
import UUpload from "../Form/UUpload";
import UInput from "../Form/UInput";
import USelect from "../Form/USelect";
import { useAddBannerMutation } from "@/redux/api/bannerApi";
import { useGetAllStoresQuery } from "@/redux/api/storeApi";
import { useGetCouponsByStoreIdQuery } from "@/redux/api/couponApi";
import { UploadOutlined } from "@ant-design/icons";

const AddbannerModal = ({ open, setOpen }) => {
  const [form] = Form.useForm();

  const [searchText, setSearchText] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [uploadedBanner, setUploadedBanner] = useState([]);
  const [uploadedArabicBanner, setUploadedArabicBanner] = useState([]);

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
        skip: !selectedStore, // 🔒 skip until store selecte d
      },
    );

  // ================= Add Banner API =================
  const [addBanner, { isLoading: isBannerLoading }] = useAddBannerMutation();

  // ================= Submit =================
  const handleSubmit = async (values, {reset}) => {
    try {
      const formData = new FormData();

      formData.append("payload", JSON.stringify(values));

      // if (values.banner?.length > 0 && values.banner[0]?.originFileObj) {
      //   formData.append("image", values.banner[0].originFileObj);
      // } else {
      //   toast.error("Please upload a valid image");
      //   return;
      // }
      // if (
      //   values.arabicBanner?.length > 0 &&
      //   values.arabicBanner[0]?.originFileObj
      // ) {
      //   formData.append("arabicImage", values.arabicBanner[0].originFileObj);
      // } else {
      //   toast.error("Please upload a valid image");
      //   return;
      // }

      if (uploadedBanner?.length > 0 && uploadedBanner[0]?.originFileObj) {
        formData.append("image", uploadedBanner[0].originFileObj);
      } else {
        toast.error("Please upload a valid image");
        return;
      }
      if (
        uploadedArabicBanner?.length > 0 &&
        uploadedArabicBanner[0]?.originFileObj
      ) {
        formData.append("arabicImage", uploadedArabicBanner[0].originFileObj);
      } else {
        toast.error("Please upload a valid image");
        return;
      }

      const res = await addBanner(formData).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Banner added successfully");
        form.resetFields();
        setUploadedBanner([]);
        setUploadedArabicBanner([]);
        setSelectedStore(null);
        setOpen(false);
        reset();
      }
    } catch (error) {
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
      width={800}
      style={{ position: "relative" }}
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

        <FormWrapper form={form} onSubmit={handleSubmit}>
          {/* Banner Image */}
          {/* <UUpload
            name="banner"
            label="Banner (English)"
            placeholder="Upload Banner"
            required
          />
          <p className="!my-4 text-xs text-gray-500">
            Image format: JPG / PNG | Recommended size: 1200×675px | Max size:
            2MB
          </p>
          <UUpload
            name="arabicBanner"
            label="صورة البانر (Arabic)"
            placeholder="قم برفع صورة البانر"
            required
            dir="rtl"
          />
          <p className="mt-1 text-right text-xs text-gray-500" dir="rtl">
            الصيغ المدعومة: JPG / PNG | المقاس الموصى به: 1200×675 بكسل | الحجم
            الأقصى: 2 ميغابايت
          </p> */}

          <div className="mb-6 rounded-lg border-2 border-dashed p-6">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              listType="picture"
              fileList={uploadedBanner}
              onChange={({ fileList }) => setUploadedBanner(fileList)}
            >
              <div className="flex w-full min-w-[752px] justify-center">
                <Button icon={<UploadOutlined />} className="mx-auto">
                  Banner Image (English)
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
              fileList={uploadedArabicBanner}
              onChange={({ fileList }) => setUploadedArabicBanner(fileList)}
            >
              <div className="flex w-full min-w-[752px] justify-center">
                <Button icon={<UploadOutlined />} className="mx-auto">
                  Banner Image (Arabic)
                </Button>
              </div>
            </Upload>
          </div>
          <p className="mt-1 text-right text-xs text-gray-500" dir="rtl">
            الصيغ المدعومة: JPG / PNG | المقاس الموصى به: 1200×675 بكسل | الحجم
            الأقصى: 2 ميغابايت
          </p>

          {/* Arabic Banner Image */}
          <UInput
            name="title"
            label="Title (English)"
            placeholder="Enter Title"
            required
          />
          <UInput
            name="arabicTitle"
            label="العنوان (Arabic)"
            placeholder="أدخل العنوان"
            required
            dir="rtl"
          />

          {/* Subtitle */}
          <UInput
            name="subTitle"
            label="Sub-Title (English)"
            placeholder="Enter Sub-Title"
            required
          />
          <UInput
            name="arabicSubTitle"
            label="العنوان الفرعي (Arabic)"
            placeholder="أدخل العنوان الفرعي"
            required
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
            onSearch={onSearch}
            onChange={(value) => {
              setSelectedStore(value); // ✅ storeId set
              form.setFieldsValue({ coupon: null }); // ✅ reset coupon
            }}
          />

          {/* Coupon Select (Dependent) */}
          <USelect
            name="coupon"
            label="Coupon (Optional)"
            placeholder={selectedStore ? "Select Coupon" : "Select Store First"}
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
            <p className="text-reda-400 mt-1 text-xs">
              Please select a store to load coupons
            </p>
          )}

          {/* Submit */}
          <Button
            htmlType="submit"
            className="mt-4 w-full"
            size="large"
            type="primary"
            loading={isBannerLoading}
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

export default AddbannerModal;
