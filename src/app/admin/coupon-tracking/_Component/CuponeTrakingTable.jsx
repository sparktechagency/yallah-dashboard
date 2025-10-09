"use client";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { Button, Table, Tag } from "antd";
import { Edit, Eye, Trash } from "lucide-react";
import React, { useState } from "react";
import CouponeDetailsModal from "./CouponeDetailsModal";
import CouponDetailsModal from "./CouponeDetailsModal";

const data = Array.from({ length: 20 }, (_, key) => ({
  key,
  Category: `Electronic ${key + 1}`,
  Region: `Region ${key + 1}`,
  discount: `${10 + key * 5}%`,
  code: `COUPON${key + 1}`,
  Brand: `Amazon ${key + 1}`,
  UserType: key % 2 === 0 ? "First Time" : "Reappeater",
  Expiry: `2023-12-${20 + key}`,
  Status: key % 2 === 0 ? "Active" : "Inactive",
  usedTime: key % 2 === 0 ? "10 times" : "5 times",
}));

function CuponeTrakingTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { title: "Coupon Code", dataIndex: "code" },
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
    { title: "Discount", dataIndex: "discount" },
    { title: "Category", dataIndex: "Category" },
    { title: "Brand/Store", dataIndex: "Brand" },
    {
      title: "User Type",
      dataIndex: "UserType",
      render: (text) => (
        <span className="">
          <Tag
            color={text === "First Time" ? "green" : "orange"}
            className="rounded-md font-bold"
          >
            {text}
          </Tag>
        </span>
      ),
    },
    { title: "Expiry", dataIndex: "Expiry" },
    { title: "Used Time", dataIndex: "usedTime" },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text) => (
        <span className="">
          <Tag
            color={text === "Active" ? "green" : "red"}
            className="rounded-md font-bold"
          >
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
          <Button
            onClick={() => setIsModalOpen(true)}
            type="primary"
            size="small"
            style={{
              backgroundColor: "#032C61",
            }}
          >
            <Eye size={16} />
          </Button>
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
        <h1 className="text-xl font-semibold">Coupon Management</h1>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
      />

      <CouponDetailsModal open={isModalOpen} setOpen={setIsModalOpen} />
    </div>
  );
}

export default CuponeTrakingTable;
