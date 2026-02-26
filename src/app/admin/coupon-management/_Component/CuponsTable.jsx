"use client";

import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { Button, Input, Select, Table, Tag, Tooltip } from "antd";
import { Copy, Edit, Eye, Filter, Plus, Search, Trash } from "lucide-react";
import React, { useMemo, useState } from "react";
import AddCuponeModal from "./AddCuponeModal";
import {
  useAddCouponMutation,
  useDeleteCouponMutation,
  useGetAllCouponsQuery,
} from "@/redux/api/couponApi";
import moment from "moment";
import CouponDetailsModal from "../../coupon-tracking/_Component/CouponeDetailsModal";
import EditCuponeModal from "./EditCuponeModal";
import toast from "react-hot-toast";
import Loader from "@/components/shared/Loader/Loader";
import debounce from "lodash/debounce";
import countryList from "react-select-country-list";
import { useGetAllStoresQuery } from "@/redux/api/storeApi";

function CuponsTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponDetails, setCouponDetails] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [selectedStore, setSelectedStore] = useState("");

  const handleSearch = debounce((value) => {
    setDebouncedSearch(value);
    setCurrentPage(1);
  }, 500);

  const { data: cupone, isLoading } = useGetAllCouponsQuery({
    limit: 10,
    page: currentPage,
    searchText: debouncedSearch,
    countries: selectedCountry,
    storeId: selectedStore,
  });

  // get store
  // get store data from api
  const { data: storeData, isLoading: isStoreLoading } = useGetAllStoresQuery({
    limit: 999999900000000,
    page: 1,
    searchText: " ",
  });

  const [addCupon] = useAddCouponMutation();

  const [deleteCoupon, { isLoading: isDeleteLoading }] =
    useDeleteCouponMutation();

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
    Brand: item?.store?.map((brand) => brand.name).join(", ") || "N/A",
    UserType: item?.applicableUserType,
    Expiry: moment(item?.validity).format("ll"),
    Status: item?.status === "active" ? "Active" : "Inactive",
    usedTime: item?.realUses || 0,
    displayUses: item?.fakeUses,
    discounttitle: item?.title,
  }));

  // // Function to duplicate a coupon
  const handleDuplicateCoupon = async (couponId) => {
    toast.loading("Duplicating coupon...", { id: "duplicate" });
    // Fetch the coupon details using the coupon ID
    const couponToDuplicate = cupone?.data?.data?.find(
      (coupon) => coupon._id === couponId,
    );

    if (!couponToDuplicate) {
      toast.error("Coupon not found for duplication.");
      return;
    }

    // Prepare the payload for duplication (you can customize this to copy exactly what you want)
    const duplicatedCouponPayload = {
      ...couponToDuplicate,
      _id: undefined, // Do not include the ID of the original coupon
      title: `${couponToDuplicate.title}`, // Customize as needed
      subtitle: `${couponToDuplicate.subtitle}`,
      code: couponToDuplicate.code, // Can generate new code if needed
      isFeatured: couponToDuplicate.isFeatured, // Copy relevant fields
      // Copying all fields that exist in the create coupon form
      store: couponToDuplicate.store?.[0]?._id,
      countries: couponToDuplicate.countries,
      couponType: couponToDuplicate.couponType,
      discountPercentage: couponToDuplicate.discountPercentage,
      arabicTitle: couponToDuplicate.arabicTitle,
      subtitle: couponToDuplicate.subtitle,
      arabicSubtitle: couponToDuplicate.arabicSubtitle,
      link: couponToDuplicate.link,
      arabicLink: couponToDuplicate.arabicLink,
      fakeUses: couponToDuplicate.fakeUses,
      validity: couponToDuplicate.validity,
      howToUse: couponToDuplicate.howToUse, // Copy how to use instructions
      arabicHowToUse: couponToDuplicate.arabicHowToUse, // Copy arabic how to use instructions
      terms: couponToDuplicate.terms, // Copy terms and conditions
      arabicTerms: couponToDuplicate.arabicTerms, // Copy arabic terms and conditions
      applicableUserType: couponToDuplicate.applicableUserType,
      status: couponToDuplicate.status,
      // Add any other custom fields if necessary
    };

    // Call the API to create the duplicated coupon
    try {
      const res = await addCupon(duplicatedCouponPayload).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Coupon duplicated successfully");
        toast.dismiss("duplicate");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to duplicate coupon");
    }
  };

  // Get country list using react-select-country-list
  const countryOptions = useMemo(() => {
    const countries = countryList().getData();
    return countries.map((country) => ({
      label: country.label,
      value: country.value,
    }));
  }, []);

  // get store name and id for filter
  const storeOptions = useMemo(() => {
    return storeData?.data?.data?.map((store) => ({
      label: store?.name,
      value: store?._id,
    }));
  }, [storeData?.data?.data]);

  const columns = [
    { title: "Coupon Code", dataIndex: "code" },
    { title: "Discount Title", dataIndex: "discounttitle" },
    { title: "Brand/Store", dataIndex: "Brand" },
    {
      title: "User Type",
      dataIndex: "UserType",
      filters: [
        {
          text: "BOTH",
          value: "BOTH",
        },
        {
          text: "REPEAT",
          value: "REPEAT",
        },
        {
          text: "FIRST TIME",
          value: "FIRST_TIME",
        },
      ],
      filterIcon: () => (
        <Filter
          size={18}
          color="#1B70A6"
          className="flex items-start justify-start"
        />
      ),
      onFilter: (value, record) => record.UserType.indexOf(value) === 0,
      render: (text) => (
        <Tag
          color={text === "First Time" ? "green" : "orange"}
          className="rounded-md font-bold"
        >
          {text}
        </Tag>
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
      onFilter: (value, record) => record.Status.indexOf(value) === 0,
      render: (text) => (
        <Tag
          color={text === "Active" ? "green" : "red"}
          className="rounded-md font-bold"
        >
          {text}
        </Tag>
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

          <Tooltip title="Duplicate">
            <Button
              className="cursor-pointer"
              onClick={() => {
                handleDuplicateCoupon(record?.id);
              }}
              size="small"
            >
              <Copy color="#1B70A6" size={18} />
            </Button>
          </Tooltip>
          <CustomConfirm
            title="Delete Coupon"
            description="Are you sure you want to delete this coupon?"
            onConfirm={() => deleteCouponHandeler(record?.id)}
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
        <div className="flex w-1/2 gap-4">
          <Input
            placeholder="Search coupons"
            prefix={<Search className="mr-2 text-black" size={20} />}
            className="h-11 !rounded-lg !border !text-base"
            onChange={(e) => handleSearch(e.target.value)}
          />

          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select countries"
            className="h-11 !rounded-lg !border !text-base"
            options={countryOptions}
            value={selectedCountry}
            onChange={(value) => {
              setSelectedCountry(value);
            }}
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
            }
            allowClear
          />
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select stores"
            className="h-11 !rounded-lg !border !text-base"
            options={storeOptions}
            value={selectedStore}
            onChange={(value) => {
              setSelectedStore(value);
            }}
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
            }
            allowClear
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
          pageSize: pageSize,
          total: cupone?.data?.meta?.total || 0,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        }}
        style={{ marginTop: "20px" }}
        loading={{ spinning: isLoading, indicator: <Loader /> }}
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
      {/* <DuplicateCuponeModal
        open={isDuplicateModalOpen}
        setOpen={setIsDuplicateModalOpen}
        couponId={couponDetails}
      /> */}
    </div>
  );
}

export default CuponsTable;
