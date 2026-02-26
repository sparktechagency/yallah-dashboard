"use client";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import AddViewerAndEditorModal from "./AddViewerAndEditorModal";
import {
  useDeleteViewerMutation,
  useGetviewersQuery,
} from "@/redux/api/viewerApi";
import moment from "moment";
import toast from "react-hot-toast";
import {
  useChangeRoleMutation,
  useDeleteAdminMutation,
  useGetAdminsQuery,
} from "@/redux/api/editorsApi";
import AddAdminModal from "./AddAdminMOdal";

export default function AdminTable() {
  const [open, setOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // get editor from api

  const { data: admindata, isLoading, isError, error } = useGetAdminsQuery({});
  // delete editor api call
  const [deleteViewer, { isLoading: deleteLoading }] = useDeleteAdminMutation();

  useEffect(() => {
    if (isError) {
      // RTK Query error structure check
      const errMsg =
        error?.data?.message || // backend sent message
        error?.error || // generic error
        "Something went wrong";

      toast.error(errMsg);
    }
  }, [isError, error]);

  if (isLoading) return <p>Loading...</p>;

  if (isError)
    return <p className="text-red-500">{error?.data?.message || "Error"}</p>;

  // delete editor handler
  const handleDelete = async (id) => {
    try {
      const res = await deleteViewer(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Admin deleted successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to deleted viewer");
    }
  };

  // change role handler

  if (isError) {
    return <div>Something went wrong : {error?.message}</div>;
  }

  const data = admindata?.data?.data?.map((item, key) => ({
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
            {/* <CustomConfirm
              title="Change Role"
              onConfirm={() => handleChangeRole(record?.email)}
              description={
                "Are you sure you want to change role viewer to editor?"
              }
            >
              <button className="border border-green-500 px-2 text-green-500">
                Change Role
              </button>
            </CustomConfirm> */}
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
        <h4 className="text-3xl font-semibold">Admin</h4>
        <Button
          type="primary"
          style={{
            marginBottom: "10px",
            background: "linear-gradient(to right, #CD5EA7, #FF9D53)",
            width: "250px",
          }}
          onClick={() => setOpen(true)}
        >
          Add Admin
        </Button>
      </section>
      <Table columns={columns} dataSource={data} loading={isLoading} />
      <AddAdminModal
        open={open}
        setOpen={setOpen}
        title={"Add Admin"}
        role={"Admin"}
      />
    </div>
  );
}
