"use client";

import { Button, Image, Pagination } from "antd";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/redux/api/categoriesApi";
import toast from "react-hot-toast";

export default function CategoryContainer() {
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  // get all ctegories from api
  const { data: categoryData, isLoading } = useGetCategoriesQuery({
    limit: 10,
    page: currentPage,
    searchText,
  });

  // delete category
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const handleDeleteCategory = async (id) => {
    try {
      const res = await deleteCategory(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Category deleted successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete category");
    }
  };

  //  table data
  const data = categoryData?.data?.data?.map((item, inx) => ({
    id: item?._id,
    key: inx + 1,
    name: item?.name,
    image: item?.image,
  }));

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
    <div>
      <Button
        type="primary"
        size="large"
        icon={<PlusCircle size={20} />}
        iconPosition="start"
        className="!w-full !py-6"
        onClick={() => setShowCreateCategoryModal(true)}
        style={{
          background: "linear-gradient(80deg, #FF9D53 0%, #CD5EA7 100%)",
        }}
      >
        Create Category
      </Button>

      {/* Categories */}
      <section className="my-10 grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {data?.map((category) => (
          <div
            key={category.key}
            className="flex flex-col items-center rounded-xl border border-primary-blue/25 p-4 shadow"
          >
            <div>
              <Image
                src={category?.image}
                alt={category?.name}
                width={100}
                height={100}
                className="h-24 w-24 rounded-full object-cover"
              />
            </div>
            <h4 className="mb-5 mt-2 text-2xl font-semibold">
              {category.name}
            </h4>

            <div className="flex-center w-full gap-x-3">
              <CustomConfirm
                title="Delete Category"
                description="Are you sure to delete this category?"
                onConfirm={() => {
                  handleDeleteCategory(category?.id);
                }}
                loading={isDeleting}
              >
                <Button className="w-full !bg-danger !text-white">
                  Delete
                </Button>
              </CustomConfirm>

              <Button
                type="primary"
                className="w-full"
                onClick={() => {
                  setShowEditCategoryModal(true);
                  setSelectedCategory(category);
                }}
                style={{
                  background:
                    "linear-gradient(80deg, #FF9D53 0%, #CD5EA7 100%)",
                }}
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </section>

      <div className="my-10 ml-auto max-w-max">
        <Pagination
          current={currentPage}
          total={categoryData?.data?.meta?.total}
          showTotal={(total) => `Total ${total} categories`}
          onChange={(page) => setCurrentPage(page)}
          style={{ fontSize: "1.2rem" }}
        />
      </div>

      {/* Create Category Modal */}
      <CreateCategoryModal
        open={showCreateCategoryModal}
        setOpen={setShowCreateCategoryModal}
      />

      {/* Edit category modal */}
      <EditCategoryModal
        open={showEditCategoryModal}
        setOpen={setShowEditCategoryModal}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}
