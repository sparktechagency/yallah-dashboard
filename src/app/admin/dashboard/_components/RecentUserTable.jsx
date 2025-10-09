"use client";

import { Image, Input, Table } from "antd";
import { Tooltip } from "antd";
import { ConfigProvider } from "antd";
import { Search } from "lucide-react";
import { Eye } from "lucide-react";
import { UserX } from "lucide-react";
import { useState } from "react";
import { Filter } from "lucide-react";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { message } from "antd";
import ProfileModal from "@/components/SharedModals/ProfileModal";
import { Tag } from "antd";
import { useGetAllusersQuery } from "@/redux/api/userApi";
import moment from "moment";

export default function RecentUserTable() {
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  // get all user from api here
  const { data: users, isLoading } = useGetAllusersQuery({
    limit: 4,
    page: 1,
    searchText: "",
  });

  const dataSource = users?.data?.data || [];
  // table Data
  const data = dataSource?.map((item, inx) => ({
    key: inx + 1,
    id: item?._id,
    name: item?.name || "N/A",
    userImg: item?.image,
    email: item?.email || "N/A",
    country: item?.country || "N/A",
    copiedCupon: item?.copies || 0,
    phone: item?.phone || "N/A",
    date: moment(item?.createdAt).format("ll"),
    status: item?.isBlocked === true ? "Blocked" : "Active",
  }));

  // Block user handler
  const handleBlockUser = () => {
    message.success("User blocked successfully");
  };

  // ================== Table Columns ================
  const columns = [
    {
      title: "Serial",
      dataIndex: "key",
      render: (value) => `#${value}`,
    },
    {
      title: "Customer Name",
      dataIndex: "name",
      render: (value, record) => {
        // Helper function to validate URL
        const isValidUrl = (url) => {
          if (!url) return false;
          return (
            url.startsWith("http://") ||
            url.startsWith("https://") ||
            url.startsWith("/")
          );
        };

        // Get the first letter of the name (uppercase)
        const firstLetter = record?.email
          ? record?.email.charAt(0).toUpperCase()
          : "";

        // Determine if the image is valid
        const hasValidImage = isValidUrl(record?.userImg);

        return (
          <div className="flex-center-start gap-x-2">
            {hasValidImage ? (
              <Image
                src={record?.userImg}
                alt="User avatar"
                width={40}
                height={40}
                className="aspect-square h-auto w-10 rounded-full"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#67cccc] text-lg font-medium text-white">
                {firstLetter}
              </div>
            )}
            <p className="font-medium">{value}</p>
          </div>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Join Date",
      dataIndex: "date",
    },
    {
      title: "Status",
      dataIndex: "status",

      filters: [
        {
          text: "Active",
          value: "Active",
        },
        {
          text: "Inactive",
          value: "Inactive",
        },
      ],
      filterIcon: () => (
        <Filter
          size={18}
          color="#1B70A6"
          className="flex items-start justify-start"
        />
      ),
      onFilter: (value, record) => record.accountType.indexOf(value) === 0,
      render: (value) => (
        <Tag color="cyan" className="!text-sm">
          {value}
        </Tag>
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <div className="flex-center-start gap-x-3">
          <Tooltip title="Show Details">
            <button
              onClick={() => {
                setProfileModalOpen(true);
                setSelectedUser(record);
              }}
            >
              <Eye color="#1B70A6" size={22} />
            </button>
          </Tooltip>

          <Tooltip title="Block User">
            <CustomConfirm
              title="Block User"
              description="Are you sure to block this user?"
              onConfirm={handleBlockUser}
            >
              <button>
                <UserX color="#F16365" size={22} />
              </button>
            </CustomConfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#032C61",
          colorInfo: "#032C61",
        },
      }}
    >
      <Table
        style={{ overflowX: "auto" }}
        columns={columns}
        dataSource={data}
        loading={isLoading}
        pagination={false}
        scroll={{ x: "100%" }}
      ></Table>

      <ProfileModal
        user={selectedUser}
        open={profileModalOpen}
        setOpen={setProfileModalOpen}
      />
    </ConfigProvider>
  );
}
