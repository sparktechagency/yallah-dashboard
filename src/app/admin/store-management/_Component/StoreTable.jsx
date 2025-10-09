"use client";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { Button, Image, Table } from "antd";
import React, { useState } from "react";
import AddStoreModal from "./AddStoreModal";
import EditStoreModal from "./EditStoreModal";
import {
  useDeleteStoreMutation,
  useGetAllStoresQuery,
} from "@/redux/api/storeApi";
import moment from "moment";
import toast from "react-hot-toast";
import Loader from "@/components/shared/Loader/Loader";

export default function StoreTable() {
  const [open, setOpen] = useState(false);
  const [editopen, setEditOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [storeId, setStoreId] = useState("");

  // get store data from api
  const { data: storeData, isLoading } = useGetAllStoresQuery({
    limit: 10,
    page: currentPage,
    searchText,
  });

  // delete store api call
  const [deleteStore, { isLoading: deleteLoading }] = useDeleteStoreMutation();

  const handleDelete = async (id) => {
    try {
      const res = await deleteStore(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Store deleted successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete store");
    }
  };

  const data = storeData?.data?.data?.map((item, inx) => ({
    id: item?._id,
    key: inx + 1,
    name: item?.name,
    img: item?.image,
    date: moment(item?.createdAt).format("ll"),
    thumbnail: item?.thumbnail,
    categories: item?.categories,
  }));
  const columns = [
    {
      title: "Store Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Store Logo",
      key: "img",
      render: (_, record) => (
        <Image alt="Store Logo" src={record?.img} width={50} height={50} />
      ),
    },
    {
      title: "Store Thumbnail",
      key: "thumbnail",
      render: (_, record) => (
        <Image
          alt="thumbnail Logo"
          src={record?.thumbnail}
          width={50}
          height={50}
        />
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditOpen(true);
              setStoreId(record);
            }}
            className="border border-green-500 px-2 text-green-500"
          >
            Edit
          </button>
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
        <h4 className="text-3xl font-semibold">Store Management</h4>
        <Button
          style={{
            width: "200px",
            height: "40px",
            background: "linear-gradient(to right, #CD5EA7, #FF9D53)",
          }}
          type="primary"
          className="flex-center gap-x-2 !text-lg"
          onClick={() => setOpen(true)}
        >
          Add Storec
        </Button>
      </section>
      <Table
        columns={columns}
        dataSource={data}
        loading={{
          spinning: isLoading,
          indicator: <Loader />,
        }}
      />
      <AddStoreModal open={open} setOpen={setOpen} />
      <EditStoreModal
        open={editopen}
        setOpen={setEditOpen}
        setStoreId={storeId}
      />
    </div>
  );
}
