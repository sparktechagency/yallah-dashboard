"use client";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { useAddModaretorMutation } from "@/redux/api/editorsApi";
import { Button, Modal } from "antd";
import toast from "react-hot-toast";

export default function AddViewerAndEditorModal({
  open,
  setOpen,
  role,
  title,
}) {
  // add editor api call
  const [addEditor, { isLoading }] = useAddModaretorMutation();

  const handleSubmit = async (data, {reset}) => {
    const toastId = toast.loading(`Adding ...${role}`);

    const payload = { ...data, role: role };
    try {
      const res = await addEditor(payload).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Editor added successfully", {
          id: toastId,
        });
        reset();
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add editor");
    }
  };
  return (
    <div>
      <Modal
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title={title}
      >
        <FormWrapper onSubmit={handleSubmit}>
          <UInput
            type="text"
            name="name"
            label="Name"
            required={true}
            placeholder="Enter name"
          />
          <UInput
            type="email"
            name="email"
            label="Email"
            required={true}
            placeholder="Enter email"
          />
          <Button
            type="primary"
            style={{
              width: "100%",
              background: "linear-gradient(to right, #CD5EA7, #FF9D53)",
            }}
            htmlType="submit"
            loading={isLoading}
          >
            Submit
          </Button>
        </FormWrapper>
      </Modal>
    </div>
  );
}
