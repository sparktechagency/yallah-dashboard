"use client";
import { DatePicker, Image, Input, Table } from "antd";
import { Tooltip } from "antd";
import { ConfigProvider } from "antd";
import { Search } from "lucide-react";
import { Eye } from "lucide-react";
import { UserX } from "lucide-react";
import { useState } from "react";
import { Filter } from "lucide-react";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import ProfileModal from "@/components/SharedModals/ProfileModal";
import { Tag } from "antd";
import {
  useBlockUnblockUserMutation,
  useGetAllusersQuery,
} from "@/redux/api/userApi";
import moment from "moment";
import toast from "react-hot-toast";
import Loader from "@/components/shared/Loader/Loader";

export default function AccDetailsTable() {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);

  // ------------------get all teachers from api--------------------->

  const { data: user, isLoading } = useGetAllusersQuery({
    limit: 10,
    page: currentPage,
    searchText,
    searchCountry,
    createdAt,
  });

  // change status api call
  const [blockUnblockUser] = useBlockUnblockUserMutation();
  const dataSource = user?.data?.data || [];

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
  const handleBlockUser = async (id) => {
    try {
      const res = await blockUnblockUser(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "User status changed successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to change user status");
    }
  };

  // ================== Table Columns ================
  const columns = [
    {
      title: "Serial",
      dataIndex: "key",
      render: (value) => `#${value}`,
    },
    {
      title: "User Name",
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
      title: "Country",
      dataIndex: "country",
    },
    {
      title: "Copied Cupon",
      dataIndex: "copiedCupon",
      render: (value) => <p className="font-medium">{value} Times</p>,
    },
    {
      title: "Date",
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
          text: "Blocked",
          value: "Blocked",
        },
      ],
      filterIcon: () => (
        <Filter
          size={18}
          color="#1B70A6"
          className="flex items-start justify-start"
        />
      ),
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (value) => (
        <Tag
          color="cyan"
          className={`!text-base font-semibold ${value === "Blocked" ? "!text-red-500" : ""}`}
        >
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
              title={
                record.status === "Blocked" ? "Unblock User" : "Block User"
              }
              description={`Are you sure to ${record.status === "Blocked" ? "Unblock" : "Block"} this user?`}
              onConfirm={() => {
                handleBlockUser(record.id);
              }}
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
      <div className="mb-3 ml-auto flex w-1/2 gap-x-5">
        <Input
          placeholder="Search by name or email"
          prefix={<Search className="mr-2 text-black" size={20} />}
          className="h-11 !rounded-lg !border !text-base"
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Input
          placeholder="Search by Country"
          prefix={<Search className="mr-2 text-black" size={20} />}
          className="h-11 !rounded-lg !border !text-base"
          onChange={(e) => setSearchCountry(e.target.value)}
        />

        <DatePicker
          className="h-11 w-full !rounded-lg"
          placeholder="Filter by Date"
          onChange={(date) => {
            if (date) {
              setCreatedAt(date.format("YYYY-MM-DD")); // 🔥 important
            } else {
              setCreatedAt(null);
            }
            setCurrentPage(1);
          }}
        />
      </div>

      <Table
        style={{ overflowX: "auto" }}
        columns={columns}
        dataSource={data}
        scroll={{ x: "100%" }}
        loading={{
          spinning: isLoading,
          indicator: <Loader />,
        }}
        pagination={{
          current: currentPage,
          pageSize: 10,
          onChange: (page) => setCurrentPage(page),
          total: user?.data?.meta?.total,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        }}
      ></Table>

      <ProfileModal
        open={profileModalOpen}
        setOpen={setProfileModalOpen}
        user={selectedUser}
      />
    </ConfigProvider>
  );
}
