"use client";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { Button, Table } from "antd";
import React, { useState } from "react";
import AddViewerAndEditorModal from "./AddViewerAndEditorModal";
import {
  useChangeRoleMutation,
  useDeleteEditorMutation,
  useGetEditorsQuery,
} from "@/redux/api/editorsApi";
import moment from "moment";
import toast from "react-hot-toast";

export default function EditorTable() {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // get editor from api

  const { data: editorData, isLoading } = useGetEditorsQuery({
    limit: 10,
    page: currentPage,
    searchText,
  });

  // delete editor api call
  const [deleteEditor, { isLoading: deleteLoading }] =
    useDeleteEditorMutation();

  // chnage role api call
  const [changeRole, { isLoading: changeLoading }] = useChangeRoleMutation();

  // delete editor handler
  const handleDelete = async (id) => {
    try {
      const res = await deleteEditor(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Editor deleted successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete editor");
    }
  };

  // change role handler
  const handleChangeRole = async (email) => {
    try {
      const res = await changeRole({ email, role: "Viewer" }).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Role changed successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to change role");
    }
  };

  const data = editorData?.data?.data?.map((item, key) => ({
    id: item?._id,
    name: item?.name,
    email: item?.email,
    date: moment(item?.createdAt).format("ll"),
  }));
  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Date", dataIndex: "date" },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <div>
            <CustomConfirm
              title="Change Role"
              onConfirm={() => handleChangeRole(record?.email)}
              description={
                "Are you sure you want to change role editor to viewer?"
              }
            >
              <button className="border border-green-500 px-2 text-green-500">
                Change Role
              </button>
            </CustomConfirm>
          </div>
          <CustomConfirm
            title="Delete"
            description={"Are you sure you want to do it?"}
            onConfirm={() => handleDelete(record?.id)}
          >
            <button className="border border-red-500 px-2 text-red-500">
              Delete
            </button>
          </CustomConfirm>
        </div>
      ),
    },
  ];
  return (
    <div>
      <section className="flex-center-between mb-10">
        <h4 className="text-3xl font-semibold">Editors</h4>
        <Button
          type="primary"
          style={{
            marginBottom: "10px",
            background: "linear-gradient(to right, #CD5EA7, #FF9D53)",
            width: "250px",
          }}
          onClick={() => setOpen(true)}
        >
          Add Editor
        </Button>
      </section>
      <Table columns={columns} dataSource={data} loading={isLoading} />
      <AddViewerAndEditorModal
        open={open}
        setOpen={setOpen}
        role={"Editor"}
        title="Add Editor"
      />
    </div>
  );
}
