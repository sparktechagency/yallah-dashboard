import React, { useState, useMemo } from "react";
import { Modal, Button, Input, Switch } from "antd";
import { Plus } from "lucide-react";
import USelect from "@/components/Form/USelect";
import UDatePicker from "@/components/Form/UDatePicker";
import FormWrapper from "@/components/Form/FormWrapper";
import { useAddCouponMutation } from "@/redux/api/couponApi";
import { useGetAllStoresQuery } from "@/redux/api/storeApi";
import countryList from "react-select-country-list";
import toast from "react-hot-toast";
import UInput from "@/components/Form/UInput";
import countries from "world-countries";

export default function AddCuponeModal({ open, setOpen }) {
  const [howToUseFields, setHowToUseFields] = useState([{ value: "" }]);
  const [howToUseFieldsAr, setHowToUseFieldsAr] = useState([{ value: "" }]);

  const [termsFields, setTermsFields] = useState([{ value: "" }]);
  const [termsFieldsAr, setTermsFieldsAr] = useState([{ value: "" }]);

  const [searchText, setSearchText] = useState("");

  const [addCupon, { isLoading }] = useAddCouponMutation();

  const { data } = useGetAllStoresQuery({
    limit: 1000,
    page: 1,
    searchText,
  });

  const countryOptions = useMemo(() => {
    return countries.map((c) => ({
      label: c.name.common, // Full country name (Bangladesh, United States, etc.)
      value: c.cca2, // ISO code (BD, US)
    }));
  }, []);

  const handleFormSubmit = async ({ couponType, ...value }, {reset}) => {
    const howToUse = howToUseFields.map((f) => f.value).filter((v) => v.trim());
    const arabicHowToUse = howToUseFieldsAr
      .map((f) => f.value)
      .filter((v) => v.trim());

    const terms = termsFields.map((f) => f.value).filter((v) => v.trim());
    const arabicTerms = termsFieldsAr
      .map((f) => f.value)
      .filter((v) => v.trim());

    const payload = {
      ...value,
      howToUse,
      arabicHowToUse,
      terms,
      arabicTerms,
      isFeatured: couponType === "deal" ? true : false,
    };

    if (couponType === "coupon" && !value.code) {
      return toast.error("Please enter a coupon code");
    }
    if (couponType === "deal" && !value.link) {
      return toast.error("Please enter the store link");
    }
    try {
      const res = await addCupon(payload).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Coupon added successfully");
        setOpen(false);
        setHowToUseFields([{ value: "" }]);
        setHowToUseFieldsAr([{ value: "" }]);
        setTermsFields([{ value: "" }]);
        setTermsFieldsAr([{ value: "" }]);
        reset();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.data?.message || "Failed to add coupon");
    }
  };

  return (
    <Modal
      centered
      open={open}
      footer={null}
      onCancel={() => setOpen(false)}
      title="Create Coupon"
      width={1000}
    >
      <FormWrapper onSubmit={handleFormSubmit}>
        {/* Store */}
        <USelect
          name="store"
          label="Store"
          required
          placeholder="Enter store name"
          options={data?.data?.data?.map((item) => ({
            label: item?.name,
            value: item?._id,
          }))}
          showSearch
          onSearch={setSearchText}
        />
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
        {/* coupon type */}
        <USelect
          type="text"
          name="couponType"
          label="Type"
          required={true}
          placeholder="Select type"
          options={[
            { label: "Coupon", value: "coupon" },
            { label: "Deal", value: "deal" },
          ]}
        />{" "}
        {/* Coupon Info */}
        <UInput
          name="code"
          label="Coupon Code"
          placeholder="Enter discount percentage"
        />
        {/* Discount percentage */}
        <UInput
          name="discountPercentage"
          label="Discount Percentage"
          required
          placeholder="Enter coupon code"
        />
        {/* Discount Title */}
        <UInput
          name="title"
          label="Discount Title (English)"
          required
          placeholder="Enter discount title"
        />
        <UInput
          name="arabicTitle"
          label="عنوان الخصم (Arabic)"
          required
          placeholder="أدخل عنوان الخصم"
          dir="rtl"
        />
        {/* Title */}
        <UInput
          name="subtitle"
          label="Title (English)"
          required
          placeholder="Enter title"
        />
        <UInput
          name="arabicSubtitle"
          label="العنوان (Arabic)"
          required
          placeholder="أدخل العنوان"
          dir="rtl"
        />
        <USelect
          type="text"
          name="type"
          label="Access Type"
          required={true}
          placeholder="Select type"
          options={[
            { label: "Free", value: "free" },
            { label: "Premium", value: "premium" },
          ]}
          showSearch
          onSearch={(value) => setSearchText(value)}
        />{" "}
        <UInput
          type="text"
          name="link"
          label="Store Link"
          placeholder="Enter store link"
        />{" "}
        <UInput
          type="text"
          name="arabicLink"
          label="Arabic Link (optional)"
          placeholder="Enter arabic store link"
        />{" "}
        <UInput
          type="number"
          name="fakeUses"
          label="Fake Uses"
          required={true}
          placeholder="Enter times used by user"
        />
        {/* Validity */}
        <UDatePicker
          name="validity"
          label="Validity"
          placeholder="Select date"
        />
        {/* How to Use - English */}
        <h3 className="mt-4 font-medium">How to Use</h3>
        {howToUseFields.map((field, index) => (
          <div key={index} className="space-y-2">
            <Input
              value={field.value}
              onChange={(e) => {
                const arr = [...howToUseFields];
                arr[index].value = e.target.value;
                setHowToUseFields(arr);
              }}
              placeholder="Enter instruction"
            />

            <div className="!my-2 flex gap-2">
              <Button
                type="primary"
                onClick={() =>
                  setHowToUseFields([...howToUseFields, { value: "" }])
                }
                style={{ backgroundColor: "#032C61" }}
              >
                + Add
              </Button>

              {index > 0 && (
                <Button
                  danger
                  onClick={() =>
                    setHowToUseFields(
                      howToUseFields.filter((_, i) => i !== index),
                    )
                  }
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        ))}
        {/* How to Use - Arabic */}
        <h3 className="mt-4 font-medium" dir="rtl">
          طريقة الاستخدام
        </h3>
        {howToUseFieldsAr.map((field, index) => (
          <div key={index} className="space-y-2" dir="rtl">
            <Input
              value={field.value}
              onChange={(e) => {
                const arr = [...howToUseFieldsAr];
                arr[index].value = e.target.value;
                setHowToUseFieldsAr(arr);
              }}
              placeholder="أدخل طريقة الاستخدام"
            />

            <div className="!my-2 flex gap-2">
              <Button
                type="primary"
                onClick={() =>
                  setHowToUseFieldsAr([...howToUseFieldsAr, { value: "" }])
                }
                style={{ backgroundColor: "#032C61" }}
              >
                + إضافة
              </Button>

              {index > 0 && (
                <Button
                  danger
                  onClick={() =>
                    setHowToUseFieldsAr(
                      howToUseFieldsAr.filter((_, i) => i !== index),
                    )
                  }
                >
                  حذف
                </Button>
              )}
            </div>
          </div>
        ))}
        {/* Terms - English */}
        <h3 className="mt-4 font-medium">Terms and Conditions</h3>
        {termsFields.map((field, index) => (
          <div key={index} className="space-y-2">
            <Input
              value={field.value}
              onChange={(e) => {
                const arr = [...termsFields];
                arr[index].value = e.target.value;
                setTermsFields(arr);
              }}
              placeholder="Enter terms"
            />

            <div className="!my-2 flex gap-2">
              <Button
                type="primary"
                onClick={() => setTermsFields([...termsFields, { value: "" }])}
                style={{ backgroundColor: "#032C61" }}
              >
                + Add
              </Button>

              {index > 0 && (
                <Button
                  danger
                  onClick={() =>
                    setTermsFields(termsFields.filter((_, i) => i !== index))
                  }
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        ))}
        {/* Terms - Arabic */}
        <h3 className="mt-4 font-medium" dir="rtl">
          الشروط والأحكام
        </h3>
        {termsFieldsAr.map((field, index) => (
          <div key={index} className="space-y-2" dir="rtl">
            <Input
              value={field.value}
              onChange={(e) => {
                const arr = [...termsFieldsAr];
                arr[index].value = e.target.value;
                setTermsFieldsAr(arr);
              }}
              placeholder="أدخل الشروط والأحكام"
              className="!mb-2 text-right"
            />

            <div className="!my-2 flex gap-2">
              <Button
                type="primary"
                onClick={() =>
                  setTermsFieldsAr([...termsFieldsAr, { value: "" }])
                }
                style={{ backgroundColor: "#032C61" }}
              >
                + إضافة
              </Button>

              {index > 0 && (
                <Button
                  danger
                  onClick={() =>
                    setTermsFieldsAr(
                      termsFieldsAr.filter((_, i) => i !== index),
                    )
                  }
                >
                  حذف
                </Button>
              )}
            </div>
          </div>
        ))}
        <div className="mb-4">
          {" "}
          <USelect
            type="text"
            name="applicableUserType"
            label="Applicable User Type"
            required={true}
            placeholder="Select user type"
            options={[
              { label: "FIRST TIME", value: "FIRST_TIME" },
              { label: "REPEAT", value: "REPEAT" },
              { label: "BOTH", value: "BOTH" },
            ]}
          />{" "}
        </div>
        <Button
          className="mt-6 w-full"
          type="primary"
          htmlType="submit"
          loading={isLoading}
          icon={<Plus size={18} />}
        >
          Create Coupon
        </Button>
      </FormWrapper>
    </Modal>
  );
}
