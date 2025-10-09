import React, { useState, useMemo } from "react";
import { Modal, Button, Form, Input, Radio } from "antd";
import { Plus } from "lucide-react";
import USelect from "@/components/Form/USelect";
import UDatePicker from "@/components/Form/UDatePicker";
import FormWrapper from "@/components/Form/FormWrapper";
import { useAddCouponMutation } from "@/redux/api/couponApi";
import { useGetAllStoresQuery } from "@/redux/api/storeApi";
import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";
import countryList from "react-select-country-list"; // Import country list
import toast from "react-hot-toast";
import UInput from "@/components/Form/UInput";

export default function AddCuponeModal({ open, setOpen, onSubmit }) {
  const [howToUseFields, setHowToUseFields] = useState([{ value: "" }]);
  const [termsFields, setTermsFields] = useState([{ value: "" }]);
  const [searchText, setSearchText] = useState("");

  // add cupon api call
  const [addCupon, { isLoading }] = useAddCouponMutation();

  // get all stores api call
  const { data } = useGetAllStoresQuery({
    limit: 1000,
    page: 1,
    searchText,
  });

  // Get country list using react-select-country-list
  const countryOptions = useMemo(() => {
    const countries = countryList().getData();
    return countries.map((country) => ({
      label: country.label,
      value: country.value,
    }));
  }, []);

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

  const handleFormSubmit = async (value) => {
    const howToUseData = howToUseFields
      .map((field) => field.value)
      .filter((value) => value.trim() !== "");
    const termsData = termsFields
      .map((field) => field.value)
      .filter((value) => value.trim() !== "");
    const formData = {
      howToUse: howToUseData,
      terms: termsData,
      ...value,
    };

    try {
      const response = await addCupon(formData).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Coupon added successfully");
        setOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.data?.message || "Failed to add coupon");
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
        title="Create Coupon"
        width={1000}
      >
        <FormWrapper onSubmit={handleFormSubmit}>
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
            onSearch={(value) => setSearchText(value)}
          />
          <USelect
            type="text"
            name="type"
            label="Type"
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
            name="link"
            label="Store Link"
            required={true}
            placeholder="Enter store link"
          />
          <UInput
            type="number"
            name="fakeUses"
            label="Fake Uses"
            required={true}
            placeholder="Enter times used by user"
          />
          <UInput
            type="text"
            name="code"
            label="Coupon Code"
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
            name="subtitle"
            label=" Title"
            required={true}
            placeholder="Enter discount title"
          />

          <h1>Validity Period (optional)</h1>
          <div className="grid grid-cols-2 gap-4">
            <UDatePicker
              name="validity"
              label="Validity"
              required={true}
              placeholder="Enter validity date"
            />
          </div>
          <h1 className="my-2 font-medium">How to Use</h1>
          {howToUseFields.map((field, index) => (
            <div
              key={index}
              style={{ marginBottom: "10px" }}
              className="space-y-5"
            >
              <Input
                value={field.value}
                onChange={(e) => handleFieldChange(e.target.value, index)}
                placeholder="Enter"
                style={{ width: "100%", marginBottom: "5px" }}
              />
              <Button
                type="primary"
                style={{ backgroundColor: "#032C61", marginRight: "10px" }}
                onClick={handleAddField}
              >
                + Add New
              </Button>
              {index > 0 && (
                <Button
                  type="primary"
                  style={{ backgroundColor: "#FF4D4F", borderColor: "#FF4D4F" }}
                  onClick={() => handleRemoveField(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <h1 className="my-2 font-medium">Terms and Conditions</h1>
          {termsFields.map((field, index) => (
            <div
              key={index}
              style={{ marginBottom: "10px" }}
              className="space-y-5"
            >
              <Input
                value={field.value}
                onChange={(e) => handletermsFieldChange(e.target.value, index)}
                placeholder="Enter"
                style={{ width: "100%", marginBottom: "5px" }}
              />
              <Button
                type="primary"
                style={{ backgroundColor: "#032C61", marginRight: "10px" }}
                onClick={handleAddTermsField}
              >
                + Add New
              </Button>
              {index > 0 && (
                <Button
                  type="primary"
                  style={{ backgroundColor: "#FF4D4F", borderColor: "#FF4D4F" }}
                  onClick={() => handleRemovetermsField(index)}
                >
                  Remove
                </Button>
              )}
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
                { label: "FIRST TIME", value: "FIRST_TIME" },
                { label: "REPEAT", value: "REPEAT" },
                { label: "BOTH", value: "BOTH" },
              ]}
            />
          </div>

          <Button
            style={{ backgroundColor: "#032C61", width: "100%" }}
            type="primary"
            htmlType="submit"
            icon={<Plus size={20} />}
            loading={isLoading}
          >
            Create
          </Button>
        </FormWrapper>
      </Modal>
    </div>
  );
}
