"use client";
import { Edit, Trash2, Tag } from "lucide-react";
import { Image, Pagination } from "antd";
import {
  useDeleteBannerMutation,
  useGetAllBannersQuery,
} from "@/redux/api/bannerApi";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { useState } from "react";
import EditbannerModal from "./EditBannerModal";
import toast from "react-hot-toast";

export default function BannerManagement() {
  const [open, setOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  // get banner api call
  const { data, isLoading } = useGetAllBannersQuery({
    limit: 100,
    page: currentPage,
    searchText: searchText,
  });

  // delete banner api call
  const [deleteBanner, { isLoading: isDeleteLoading }] =
    useDeleteBannerMutation();

  const banners = data?.data?.data || [];

  const handleEdit = (banner) => {
    console.log("Edit banner:", banner);
    setOpen(true);
    setSelectedBanner(banner);
  };

  const handleDelete = async (banner) => {
    try {
      const res = await deleteBanner(banner).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Banner deleted successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete banner");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-9xl mx-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg bg-white shadow-md"
              >
                <div className="p-0">
                  <div className="h-48 rounded-t-lg bg-gray-200"></div>
                </div>
                <div className="p-4">
                  <div className="mb-2 h-4 rounded bg-gray-200"></div>
                  <div className="mb-4 h-3 rounded bg-gray-200"></div>
                  <div className="flex gap-2">
                    <div className="h-9 flex-1 rounded bg-gray-200"></div>
                    <div className="h-9 flex-1 rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-9xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700">
            Total: {banners.length} banners
          </span>
        </div>

        {banners.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">No banners found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="p-0">
                  <div className="relative">
                    <Image
                      src={banner.image || "/placeholder.svg"}
                      alt={banner.title}
                      className="!h-[150px] w-full object-contain object-center"
                      onError={(e) => {
                        e.target.src = "/banner-placeholder.jpg";
                      }}
                    />
                    {banner.coupon && (
                      <span className="absolute right-2 top-2 flex items-center rounded-md bg-green-500 px-2 py-1 text-xs font-medium text-white hover:bg-green-600">
                        <Tag className="mr-1 h-3 w-3" />
                        {banner.coupon.code}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {banner.title}
                  </h3>
                  <p className="mb-3 text-sm text-gray-600">
                    {banner.subTitle}
                  </p>

                  <div className="mb-4 text-xs text-gray-500">
                    <p>Created: {formatDate(banner.createdAt)}</p>
                    <p>Updated: {formatDate(banner.updatedAt)}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="flex flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => handleEdit(banner)}
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </button>
                    <CustomConfirm
                      title="Delete"
                      description="Are you sure you want to delete this banner?"
                      okText="Delete"
                      okType="danger"
                      onConfirm={() => handleDelete(banner?._id)}
                    >
                      <button className="flex flex-1 items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </button>
                    </CustomConfirm>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-10 flex justify-end">
        <Pagination
          current={currentPage}
          total={data?.data?.meta?.total}
          pageSize={"10"}
          onChange={(page) => {
            setCurrentPage(page);
          }}
        />
      </div>
      <EditbannerModal
        open={open}
        setOpen={setOpen}
        selectedBanner={selectedBanner}
      />
    </div>
  );
}
