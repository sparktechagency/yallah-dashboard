"use client";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { Button, Input, Table, Tag, Tooltip } from "antd";
import { Edit, Eye, Plus, Search, Trash } from "lucide-react";
import React, { useState } from "react";
import AddCuponeModal from "./AddCuponeModal";
import {
  useDeleteCouponMutation,
  useGetAllCouponsQuery,
} from "@/redux/api/couponApi";
import moment from "moment";
import CouponDetailsModal from "../../coupon-tracking/_Component/CouponeDetailsModal";
import EditCuponeModal from "./EditCuponeModal";
import toast from "react-hot-toast";
import Loader from "@/components/shared/Loader/Loader";

function CuponsTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponDetails, setCouponDetails] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // get all coupons api call
  const { data: cupone, isLoading } = useGetAllCouponsQuery({
    limit: 100,
    page: currentPage,
    searchText,
  });

  // delete coupon api call
  const [deleteCoupon, { isLoading: isDeleteLoading }] =
    useDeleteCouponMutation();

  // delete coupone handeler

  const deleteCouponHandeler = async (id) => {
    try {
      const res = await deleteCoupon(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Coupon deleted successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete coupon");
    }
  };

  const data = cupone?.data?.data?.map((item, key) => ({
    key,
    id: item?._id,
    code: item?.code || "N/A",
    Brand: item?.store?.map((brand) => brand.name).join(", "),
    UserType: item?.applicableUserType,
    Expiry: moment(item?.validity).format("ll"),
    Status: item?.status === "active" ? "Active" : "Inactive",
    usedTime: item?.realUses || 0,
    displayUses: item?.fakeUses,
    discounttitle: item?.title,
  }));

  const columns = [
    { title: "Coupon Code", dataIndex: "code" },
    { title: "Discount Title", dataIndex: "discounttitle" },
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
      title: "Display Uses",
      dataIndex: "displayUses",
      render: (text) => <span>{text} times</span>,
    },
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
      render: (_, record) => (
        <div className="flex gap-4">
          <Tooltip title="View Details">
            <button
              onClick={() => {
                setIsCouponModalOpen(true);
                setCouponDetails(record?.id);
              }}
            >
              <Eye color="#1B70A6" size={22} />
            </button>
          </Tooltip>
          <Tooltip title="Edit">
            <button
              onClick={() => {
                setIsEditModalOpen(true);
                setCouponDetails(record?.id);
              }}
            >
              <Edit color="#1B70A6" size={22} />
            </button>
          </Tooltip>

          <CustomConfirm
            title="Delete Coupon"
            description="Are you sure you want to delete this coupon?"
            onConfirm={() => {
              deleteCouponHandeler(record?.id);
            }}
            loading={isDeleteLoading}
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
        <div className="w-1/3">
          <Input
            placeholder="Search coupons"
            prefix={<Search className="mr-2 text-black" size={20} />}
            className="h-11 !rounded-lg !border !text-base"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          icon={<Plus size={20} />}
          style={{
            backgroundImage: "linear-gradient(90deg, #FFD6B3 0%, #de54b1 100%)",
            width: "300px",
            height: "40px",
          }}
          type="primary"
          className="flex items-center justify-center !text-lg !font-semibold"
        >
          Add New Coupon
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          current: currentPage,
          pageSize: 10,
          onChange: (page) => setCurrentPage(page),
          total: cupone?.data?.meta?.total,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        }}
        style={{ marginTop: "20px" }}
        loading={{
          spinning: isLoading,
          indicator: <Loader />,
        }}
      />
      <AddCuponeModal open={isModalOpen} setOpen={setIsModalOpen} />
      <CouponDetailsModal
        open={isCouponModalOpen}
        setOpen={setIsCouponModalOpen}
        couponDetails={couponDetails}
      />
      <EditCuponeModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        couponId={couponDetails}
      />
    </div>
  );
}

export default CuponsTable;
