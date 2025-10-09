"use client";

import Image from "next/image";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
  useDeletethumbnailsMutation,
  useGetAllthumbnailsQuery,
} from "@/redux/api/thumbnailApi";
import { useState } from "react";
import EditthumbnailModal from "../../addbanner/_Component/EditthumbnailModal";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import toast from "react-hot-toast";

function ThumbnailList() {
  const [open, setOpen] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  // Get all thumbnails from API
  const { data, isLoading, isError } = useGetAllthumbnailsQuery({
    limit: 100,
    page: 1,
    searchText: "",
  });

  // Delete thumbnail from API
  const [deleteThumbnail, { isLoading: isDeleteLoading }] =
    useDeletethumbnailsMutation();

  // Placeholder handlers for Edit and Delete (replace with your logic)
  const handleEdit = (thumbnailId) => {
    console.log("Edit thumbnail:", thumbnailId);
    // TODO: e.g., Open edit modal or navigate to edit page
  };

  const handleDelete = async (thumbnailId) => {
    console.log("Delete thumbnail:", thumbnailId);
    try {
      const res = await deleteThumbnail(thumbnailId).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Thumbnail deleted successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete thumbnail");
    }
  };
  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Error state
  if (isError || !data?.data?.length) {
    return (
      <div className="py-8 text-center text-gray-500">
        No thumbnails available or failed to load.
      </div>
    );
  }

  // Thumbnails data
  const thumbnails = data.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        Thumbnail Banners
      </h2>

      {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {thumbnails.map((thumbnail) => (
          <div
            key={thumbnail._id}
            className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
          >
            {/* Thumbnail Image */}
            <div className="relative h-48 w-full">
              <Image
                src={thumbnail?.image}
                layout="fill"
                alt={`Banner for ${thumbnail.coupon?.title || "Coupon"}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.src = "/fallback-image.jpg"; // Optional: Fallback image URL
                }}
              />
              {/* Optional: Overlay icon for "view" feel */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 transition-opacity duration-300 hover:bg-opacity-20 hover:opacity-100">
                <EyeIcon className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Coupon Details */}
            <div className="p-4">
              <h3 className="mb-1 text-lg font-semibold text-gray-800">
                {thumbnail.coupon?.title || "Untitled Banner"}
              </h3>
              <p className="mb-2 text-sm text-gray-600">
                Code: {thumbnail.coupon?.code || "N/A"}
              </p>
              <p className="text-xs text-gray-500">
                Created: {new Date(thumbnail.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 px-4 pb-4">
              <button
                onClick={() => {
                  setSelectedThumbnail(thumbnail);
                  setOpen(true);
                }}
                className="flex items-center rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors duration-200 hover:bg-blue-100"
              >
                <PencilIcon className="mr-1 h-4 w-4" />
                Edit
              </button>
              <CustomConfirm
                onConfirm={() => handleDelete(thumbnail._id)}
                title="Delete"
              >
                <button className="flex items-center rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-100">
                  <TrashIcon className="mr-1 h-4 w-4" />
                  Delete
                </button>
              </CustomConfirm>
            </div>
          </div>
        ))}
      </div>

      <EditthumbnailModal
        open={selectedThumbnail}
        setOpen={setSelectedThumbnail}
        selectedBanner={selectedThumbnail}
      />
    </div>
  );
}

export default ThumbnailList;
