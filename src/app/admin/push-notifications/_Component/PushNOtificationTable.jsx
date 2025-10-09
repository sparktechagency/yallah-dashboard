"use client";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { Button, Table, Tag } from "antd";
import { Edit, Plus, Trash } from "lucide-react";
import React, { useState } from "react";
import PushNotificationModal from "./PushNotificationModal";
import { useGetPushNotificationQuery } from "@/redux/api/pushnotificationApi";
import moment from "moment";
import Loader from "@/components/shared/Loader/Loader";

function PushNOtificationTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // get notification data from api
  const { data: notificationData, isLoading } = useGetPushNotificationQuery();

  const data = notificationData?.data?.data?.map((item, key) => ({
    key,
    title: item?.title,
    description: item?.body,
    Category: item?.coupon?.store?.categories
      ?.map((item) => item?.name)
      .join(", "),
    Region: item?.coupon?.countries?.join(", "),
    code: item?.coupon?.code,
    Expiry: moment(item?.coupon?.validity).format("ll"),
    cuponTitle: item?.coupon?.title,
  }));

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
      render: () => (
        <div>
          <CustomConfirm
            title="Delete Coupon"
            description="Are you sure you want to delete this coupon?"
            onConfirm={() => {
              // Handle delete action
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
