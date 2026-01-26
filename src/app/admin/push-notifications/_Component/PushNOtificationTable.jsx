"use client";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { Button, Table, Tag } from "antd";
import { Plus, Trash } from "lucide-react";
import React, { useState } from "react";
import PushNotificationModal from "./PushNotificationModal";
import {
  useDeleteNotificationMutation,
  useGetPushNotificationQuery,
} from "@/redux/api/pushnotificationApi";
import moment from "moment";
import Loader from "@/components/shared/Loader/Loader";
import toast from "react-hot-toast";

function PushNOtificationTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // get notification data from api
  const { data: notificationData, isLoading } = useGetPushNotificationQuery();

  // delete notification api call
  const [deleteNotification, { isLoading: isDeleteLoading }] =
    useDeleteNotificationMutation();

  const data = notificationData?.data?.data?.map((item, key) => ({
    key,
    title: item?.title,
    id: item?._id,
    description: item?.body,
    Category: item?.coupon?.store?.categories
      ?.map((item) => item?.name)
      .join(", "),
    Region: item?.coupon?.countries?.join(", "),
    code: item?.coupon?.code,
    Expiry: moment(item?.coupon?.validity).format("ll"),
    cuponTitle: item?.coupon?.title,
  }));

  if (isLoading) {
    return <Loader />;
  }

  const handleDeleteNotification = async (id) => {
    try {
      const res = await deleteNotification(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Notification deleted successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete notification");
    }
  };

  const columns = [
    { title: "Notification Title", dataIndex: "title" },
    { title: "Notification Description", dataIndex: "description" },
    {
      title: "Region",
      dataIndex: "Region",
      render: (text) => (
        <span className="">
          <Tag color="blue" className="rounded-md font-bold">
            {text}
          </Tag>
        </span>
      ),
    },
    { title: "Cupon Category", dataIndex: "Category" },
    { title: "Coupon Title", dataIndex: "cuponTitle" },
    { title: "Cupon Validity", dataIndex: "Expiry" },
    {
      title: "Cupon Code",
      dataIndex: "code",
      render: (text) => (
        <span className="cursor-pointer">
          <Tag color="green" className="rounded-md font-bold">
            {text}
          </Tag>
        </span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div>
          <CustomConfirm
            title="Delete Coupon"
            description="Are you sure you want to delete this coupon?"
            onConfirm={() => {
              handleDeleteNotification(record?.id);
            }}
          >
            <Button type="primary" size="small" danger className="ml-2">
              <Trash size={16} />
            </Button>
          </CustomConfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Push Notifications</h2>
        <Button
          type="primary"
          size="large"
          style={{
            background: "linear-gradient(to right, #CD5EA7, #FF9D53)",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          Send Notification <Plus size={16} />
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        loading={{
          spinning: isLoading,
          indicator: <Loader />,
        }}
        scroll={{ x: "max-content" }}
      />
      <PushNotificationModal open={isModalOpen} setOpen={setIsModalOpen} />
    </div>
  );
}

export default PushNOtificationTable;
