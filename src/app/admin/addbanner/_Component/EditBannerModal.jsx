"use client";
import { Button, Divider, Form, Input, Modal, Select, Upload } from "antd";
import { RiCloseLargeLine } from "react-icons/ri";
import { useGetAllCouponsQuery } from "@/redux/api/couponApi";
import { useState } from "react";
import toast from "react-hot-toast";
import { useUpdateBannerMutation } from "@/redux/api/bannerApi";
import { UploadOutlined } from "@ant-design/icons";

const EditbannerModal = ({ open, setOpen, selectedBanner }) => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  // Get coupons
  const { data, isLoading } = useGetAllCouponsQuery({
    limit: 100,
    page: 1,
    searchText: searchText,
  });

  // Update banner
  const [updateBanner, { isLoading: isBannerLoading }] =
    useUpdateBannerMutation();

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("payload", JSON.stringify(values));
      formData.append("image", values.banner[0].originFileObj);
      const res = await updateBanner({
        id: selectedBanner._id,
        formData,
      }).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Banner updated successfully");
        form.resetFields();
        setOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.data?.message || "Failed to update banner");
    }
  };

  const onSearch = (value) => {
    setSearchText(value);
  };

  // Normalize file for Upload component
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
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
        <h4 className="text-center text-2xl font-medium">Edit Banner</h4>
        <Divider />
        <div className="flex-1">
          <Form
            form={form}
            onFinish={handleSubmit}
            initialValues={{
              title: selectedBanner?.title,
              subTitle: selectedBanner?.subTitle,
              coupon: selectedBanner?.coupon?._id || null,
              arabicTitle: selectedBanner?.arabicTitle,
              arabicSubTitle: selectedBanner?.arabicSubTitle,
              banner: selectedBanner?.image
                ? [
                    {
                      uid: "-1",
                      name: "banner",
                      status: "done",
                      url: selectedBanner.image,
                    },
                  ]
                : [],
              arabicBanner: selectedBanner?.arabicImage
                ? [
                    {
                      uid: "-1",
                      name: "arabicBanner",
                      status: "done",
                      url: selectedBanner.arabicImage,
                    },
                  ]
                : [],
            }}
            layout="vertical"
          >
            <Form.Item
              name="banner"
              label="Banner"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[
                { required: true, message: "Please upload a banner image" },
              ]}
            >
              <Upload
                listType="picture"
                maxCount={1}
                beforeUpload={() => false} // Prevent auto-upload
              >
                <Button icon={<UploadOutlined />}>Upload Banner</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              name="arabicBanner"
              label="Banner (Arabic)"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[
                { required: true, message: "Please upload a banner image" },
              ]}
            >
              <Upload
                listType="picture"
                maxCount={1}
                beforeUpload={() => false} // Prevent auto-upload
              >
                <Button icon={<UploadOutlined />}>
                  Upload Banner (Arabic)
                </Button>
              </Upload>
            </Form.Item>

            {/* Title */}
            <Form.Item
              name="title"
              label="Title (English)"
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input placeholder="Enter Title" />
            </Form.Item>

            <Form.Item
              name="arabicTitle"
              label="العنوان (Arabic)"
              rules={[{ required: true, message: "يرجى إدخال العنوان" }]}
            >
              <Input placeholder="أدخل العنوان" dir="rtl" />
            </Form.Item>

            {/* Sub-Title */}
            <Form.Item
              name="subTitle"
              label="Sub-Title (English)"
              rules={[{ required: true, message: "Please enter a sub-title" }]}
            >
              <Input placeholder="Enter Sub-Title" />
            </Form.Item>

            <Form.Item
              name="arabicSubTitle"
              label="العنوان الفرعي (Arabic)"
              rules={[{ required: true, message: "يرجى إدخال العنوان الفرعي" }]}
            >
              <Input placeholder="أدخل العنوان الفرعي" dir="rtl" />
            </Form.Item>

            <Form.Item
              name="coupon"
              label="Coupon"
              rules={[{ required: true, message: "Please select a coupon" }]}
            >
              <Select
                placeholder="Select Coupon"
                showSearch
                onSearch={onSearch}
                filterOption={false}
                options={data?.data?.data?.map((item) => ({
                  label: item.title,
                  value: item._id,
                }))}
              />
            </Form.Item>

            <Form.Item>
              <Button
                htmlType="submit"
                className="w-full"
                size="large"
                type="primary"
                style={{
                  background:
                    "linear-gradient(80deg, #FF9D53 0%, #CD5EA7 100%)",
                }}
                loading={isBannerLoading}
              >
                Save
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default EditbannerModal;
