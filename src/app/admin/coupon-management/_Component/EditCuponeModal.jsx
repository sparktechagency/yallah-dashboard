"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Modal, Button, Input } from "antd";
import { Plus } from "lucide-react";
import USelect from "@/components/Form/USelect";
import UDatePicker from "@/components/Form/UDatePicker";
import FormWrapper from "@/components/Form/FormWrapper";
import {
  useGetCouponByIdQuery,
  useUpdateCouponMutation,
} from "@/redux/api/couponApi";
import { useGetAllStoresQuery } from "@/redux/api/storeApi";
import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";
import countryList from "react-select-country-list";
import toast from "react-hot-toast";
import UInput from "@/components/Form/UInput";
import moment from "moment";

export default function EditCuponeModal({ open, setOpen, couponId }) {
  const [howToUseFields, setHowToUseFields] = useState([{ value: "" }]);
  const [termsFields, setTermsFields] = useState([{ value: "" }]);
  const [howToUseFieldsAr, setHowToUseFieldsAr] = useState([{ value: "" }]);
  const [termsFieldsAr, setTermsFieldsAr] = useState([{ value: "" }]);
  const [searchText, setSearchText] = useState("");
  const [categoriesearchText, setCategoriesearchText] = useState("");

  // edit coupon api call
  const [editCupon, { isLoading: isEditLoading }] = useUpdateCouponMutation();
  // get single coupon api call
  const { data: couponData, isLoading: isCouponLoading } =
    useGetCouponByIdQuery(couponId, {
      skip: !couponId,
    });

  // get all stores api call
  const { data } = useGetAllStoresQuery({
    limit: 1000,
    page: 1,
    searchText,
  });

  // get all categories api call
  const { data: categoriesData } = useGetCategoriesQuery({
    limit: 1000,
    page: 1,
    searchText: categoriesearchText,
  });

  // Get country list using react-select-country-list
  const countryOptions = useMemo(() => {
    const countries = countryList().getData();
    return countries.map((country) => ({
      label: country.label,
      value: country.value,
    }));
  }, []);

  // Initialize howToUseFields and termsFields when couponData is loaded
  useEffect(() => {
    if (couponData?.data && open) {
      // Set howToUseFields
      const howToUse = couponData.data.howToUse?.length
        ? couponData.data.howToUse.map((item) => ({ value: item }))
        : [{ value: "" }];
      setHowToUseFields(howToUse);

      // Set howToUseFieldsAr
      const howToUseAr = couponData.data.arabicHowToUse?.length
        ? couponData.data.arabicHowToUse.map((item) => ({ value: item }))
        : [{ value: "" }];
      setHowToUseFieldsAr(howToUseAr);

      // Set termsFields
      const terms = couponData.data.terms?.length
        ? couponData.data.terms.map((item) => ({ value: item }))
        : [{ value: "" }];
      setTermsFields(terms);
      // Set termsFieldsAr
      const termsAr = couponData.data.arabicTerms?.length
        ? couponData.data.arabicTerms.map((item) => ({ value: item }))
        : [{ value: "" }];
      setTermsFieldsAr(termsAr);
    }
  }, [couponData, open]);

  const handleAddField = () => {
    setHowToUseFields([...howToUseFields, { value: "" }]);
  };

  const handleRemoveField = (index) => {
    const updatedFields = howToUseFields.filter((_, i) => i !== index);
    setHowToUseFields(updatedFields);
  };

  const handleFieldChange = (value, index) => {
    const updatedFields = [...howToUseFields];
    updatedFields[index].value = value;
    setHowToUseFields(updatedFields);
  };

  const handleAddTermsField = () => {
    setTermsFields([...termsFields, { value: "" }]);
  };

  const handleRemovetermsField = (index) => {
    const updatedtermsFields = termsFields.filter((_, i) => i !== index);
    setTermsFields(updatedtermsFields);
  };

  const handletermsFieldChange = (value, index) => {
    const updatedtermsFields = [...termsFields];
    updatedtermsFields[index].value = value;
    setTermsFields(updatedtermsFields);
  };

  // Handlers for Arabic fields
  const handleAddFieldAr = () =>
    setHowToUseFieldsAr([...howToUseFieldsAr, { value: "" }]);
  const handleRemoveFieldAr = (index) =>
    setHowToUseFieldsAr(howToUseFieldsAr.filter((_, i) => i !== index));
  const handleFieldChangeAr = (value, index) => {
    const arr = [...howToUseFieldsAr];
    arr[index].value = value;
    setHowToUseFieldsAr(arr);
  };

  const handleAddTermsFieldAr = () =>
    setTermsFieldsAr([...termsFieldsAr, { value: "" }]);
  const handleRemoveTermsFieldAr = (index) =>
    setTermsFieldsAr(termsFieldsAr.filter((_, i) => i !== index));
  const handleTermsFieldChangeAr = (value, index) => {
    const arr = [...termsFieldsAr];
    arr[index].value = value;
    setTermsFieldsAr(arr);
  };

  const handleFormSubmit = async ({ couponType, ...value }) => {
    const howToUseData = howToUseFields
      .map((field) => field.value)
      .filter((value) => value.trim() !== "");
    const termsData = termsFields
      .map((field) => field.value)
      .filter((value) => value.trim() !== "");
    const howToUseDataAr = howToUseFieldsAr
      .map((field) => field.value)
      .filter((v) => v.trim() !== "");
    const termsDataAr = termsFieldsAr
      .map((field) => field.value)
      .filter((v) => v.trim() !== "");
    const formData = {
      ...value,
      howToUse: howToUseData,
      terms: termsData,
      howToUseAr: howToUseDataAr,
      termsAr: termsDataAr,
      isFeatured: couponType === "deal" ? true : false,
    };

    if (couponType === "coupon" && !value.code) {
      return toast.error("Please enter a coupon code");
    }
    if (couponType === "deal" && !value.link) {
      return toast.error("Please enter the store link");
    }

    try {
      const response = await editCupon({ formData, id: couponId }).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Coupon updated successfully");
        setOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.data?.message || "Failed to update coupon");
    }
  };

  return (
    <div>
      <Modal
        centered
        open={open}
        footer={null}
        onCancel={() => {
          setOpen(false);
        }}
        title="Edit Coupon"
        width={1000}
        loading={isEditLoading || isCouponLoading}
      >
        <FormWrapper
          onSubmit={handleFormSubmit}
          defaultValues={{
            store: couponData?.data?.store?._id,
            categories: couponData?.data?.categories?.map((item) => item?._id),
            countries: couponData?.data?.countries,
            link: couponData?.data?.link,
            fakeUses: couponData?.data?.fakeUses,
            title: couponData?.data?.title,
            discountPercentage: couponData?.data?.discountPercentage,
            subtitle: couponData?.data?.subtitle,
            code: couponData?.data?.code,
            discount: couponData?.data?.discount,
            validity: couponData?.data?.validity
              ? moment(couponData?.data?.validity)
              : null,
            applicableUserType: couponData?.data?.applicableUserType,
            status: couponData?.data?.status,
            type: couponData?.data?.type,
            arabicTitle: couponData?.data?.arabicTitle,
            arabicSubtitle: couponData?.data?.arabicSubtitle,
            arabicLink: couponData?.data?.arabicLink,
            couponType:
              couponData?.data?.isFeatured == true ? "deal" : "coupon",
          }}
        >
          <USelect
            type="text"
            name="store"
            label="Store"
            required={true}
            placeholder="Enter store name"
            options={data?.data?.data?.map((item) => ({
              label: item?.name,
              value: item?._id,
            }))}
            showSearch
            onSearch={(value) => setSearchText(value)}
          />
          <USelect
            type="text"
            name="countries"
            mode="multiple"
            label="Country Name"
            required={true}
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
          <UInput
            type="text"
            name="link"
            label="Store Link"
            placeholder="Enter store link"
          />
          <UInput
            type="text"
            name="arabicLink"
            label="Arabic Link (optional)"
            placeholder="Enter arabic store link"
          />
          <UInput
            type="number"
            name="fakeUses"
            label="Fake Uses"
            required={true}
            placeholder="Enter times used by user"
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
          />
          <UInput
            type="text"
            name="code"
            label="Coupon Code"
            placeholder="Enter coupon code"
          />
          {/* Discount percentage */}
          <UInput
            name="discountPercentage"
            label="Discount Percentage"
            required={true}
            placeholder="Enter coupon code"
          />
          <UInput
            type="text"
            name="title"
            label="Discount Title"
            required={true}
            placeholder="Enter discount title"
          />
          <UInput
            type="text"
            name="arabicTitle"
            label="Discount Title (Ar)"
            required={true}
            placeholder="Enter discount title"
          />
          <UInput
            type="text"
            name="subtitle"
            label="Subtitle (English)"
            required={true}
            placeholder="Enter subtitle"
          />
          <UInput
            type="text"
            name="arabicSubtitle"
            label="Subtitle (Ar)"
            required={true}
            placeholder="Enter subtitle"
          />
          <h1>Validity Period</h1>
          <div className="grid grid-cols-2 gap-4">
            <UDatePicker
              name="validity"
              label="Validity"
              required={true}
              placeholder="Enter validity date"
            />
          </div>
          {/* How to Use */}
          <h1 className="my-2 font-medium">How to Use (English)</h1>
          {howToUseFields.map((field, index) => (
            <div key={index} className="space-y-2">
              <Input
                value={field.value}
                onChange={(e) => handleFieldChange(e.target.value, index)}
                placeholder="Enter"
                style={{ width: "100%", marginBottom: "5px" }}
              />
              <div className="!my-3 flex gap-2">
                <Button
                  type="primary"
                  style={{ backgroundColor: "#032C61" }}
                  onClick={handleAddField}
                >
                  + Add New
                </Button>
                {index > 0 && (
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#FF4D4F",
                      borderColor: "#FF4D4F",
                    }}
                    onClick={() => handleRemoveField(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
          <h1 className="my-2 font-medium" dir="rtl">
            طريقة الاستخدام (Arabic)
          </h1>
          {howToUseFieldsAr.map((field, index) => (
            <div key={index} className="space-y-2" dir="rtl">
              <Input
                value={field.value}
                onChange={(e) => handleFieldChangeAr(e.target.value, index)}
                placeholder="أدخل طريقة الاستخدام"
                style={{ width: "100%", marginBottom: "5px" }}
              />
              <div className="!my-3 flex gap-2">
                <Button
                  type="primary"
                  style={{ backgroundColor: "#032C61" }}
                  onClick={handleAddFieldAr}
                >
                  + إضافة
                </Button>
                {index > 0 && (
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#FF4D4F",
                      borderColor: "#FF4D4F",
                    }}
                    onClick={() => handleRemoveFieldAr(index)}
                  >
                    حذف
                  </Button>
                )}
              </div>
            </div>
          ))}
          {/* Terms & Conditions */}
          <h1 className="my-2 font-medium">Terms and Conditions (English)</h1>
          {termsFields.map((field, index) => (
            <div key={index} className="space-y-2">
              <Input
                value={field.value}
                onChange={(e) => handletermsFieldChange(e.target.value, index)}
                placeholder="Enter"
                style={{ width: "100%", marginBottom: "5px" }}
              />
              <div className="!my-3 flex gap-2">
                <Button
                  type="primary"
                  style={{ backgroundColor: "#032C61" }}
                  onClick={handleAddTermsField}
                >
                  + Add New
                </Button>
                {index > 0 && (
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#FF4D4F",
                      borderColor: "#FF4D4F",
                    }}
                    onClick={() => handleRemovetermsField(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
          <h1 className="my-2 font-medium" dir="rtl">
            الشروط والأحكام (Arabic)
          </h1>
          {termsFieldsAr.map((field, index) => (
            <div key={index} className="space-y-2" dir="rtl">
              <Input
                value={field.value}
                onChange={(e) =>
                  handleTermsFieldChangeAr(e.target.value, index)
                }
                placeholder="أدخل الشروط والأحكام"
                style={{ width: "100%", marginBottom: "5px" }}
              />
              <div className="!my-3 flex gap-2">
                <Button
                  type="primary"
                  style={{ backgroundColor: "#032C61" }}
                  onClick={handleAddTermsFieldAr}
                >
                  + إضافة
                </Button>
                {index > 0 && (
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#FF4D4F",
                      borderColor: "#FF4D4F",
                    }}
                    onClick={() => handleRemoveTermsFieldAr(index)}
                  >
                    حذف
                  </Button>
                )}
              </div>
            </div>
          ))}
          <div className="mb-4">
            <USelect
              type="text"
              name="applicableUserType"
              label="Applicable User Type"
              required={true}
              placeholder="Select user type"
              options={[
                { label: "First Time", value: "FIRST_TIME" },
                { label: "Repeat", value: "REPEAT" },
                { label: "Both", value: "BOTH" },
              ]}
            />
          </div>
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
            style={{ backgroundColor: "#032C61", width: "100%" }}
            type="primary"
            htmlType="submit"
            icon={<Plus size={20} />}
            loading={isEditLoading || isCouponLoading}
          >
            Update
          </Button>
        </FormWrapper>
      </Modal>
    </div>
  );
}
