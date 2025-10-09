"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UTextEditor from "@/components/Form/UTextEditor";
import {
  useGetContentsQuery,
  useUpdateContentMutation,
} from "@/redux/api/contentApi";

import { Button } from "antd";
import { Edit } from "lucide-react";
import toast from "react-hot-toast";

export default function TermsConditionsContainer() {
  const { data } = useGetContentsQuery();
  const value = data?.data?.termsConditions;

  console.log("value", value);
  // update contetnt api handeller
  const [updateContent, { isLoading: updating }] = useUpdateContentMutation();

  const handleSubmit = async (values) => {
    try {
      const res = await updateContent(values).unwrap();
      if (res.success) {
        toast.success("Content Update Successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <section>
      <h3 className="mb-6 text-2xl font-semibold">Terms & Conditions</h3>

      <FormWrapper onSubmit={handleSubmit}>
        <UTextEditor
          value={value}
          name="termsConditions"
          placeholder="Note: Enter details about your terms & Conditions here."
        />
        <Button
          type="primary"
          disabled={updating}
          style={{
            background: "linear-gradient(80deg, #FF9D53 0%, #CD5EA7 100%)",
          }}
          loading={updating}
          size="large"
          className="w-full rounded-xl"
          htmlType="submit"
          icon={<Edit size={18} />}
        >
          Save Changes
        </Button>
      </FormWrapper>
    </section>
  );
}
