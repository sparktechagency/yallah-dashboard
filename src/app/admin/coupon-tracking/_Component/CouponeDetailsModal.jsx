"use client";

import { useGetCouponByIdQuery } from "@/redux/api/couponApi";
import { Skeleton } from "antd";

export default function CouponDetailsModal({
  open,
  setOpen,
  couponDetails: id,
}) {
  const { data, isLoading } = useGetCouponByIdQuery(id, { skip: !id });

  if (!open) return null;
  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <div className="">
          <Skeleton.Button
            active={true}
            size={"100px"}
            shape={"square"}
            style={{ height: "320px", width: "500px" }}
            block={true}
            className="animate-pulse"
          />
        </div>
      </div>
    );

  const coupon = data?.data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <div className="animate-in fade-in-0 zoom-in-95 relative mx-4 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl duration-300">
        {/* Header with gradient background */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-6 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <h2 className="text-2xl font-bold">Coupon Details</h2>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-2 transition-colors duration-200 hover:bg-white/20"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 p-8">
          {/* Coupon Title */}
          <div className="text-center">
            <h3 className="mb-2 text-3xl font-bold text-gray-800">
              {coupon?.title || "Coupon Title"}
            </h3>
            <div className="inline-flex items-center rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
              <svg
                className="mr-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Valid till:{" "}
              {new Date(coupon?.validity).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }) || "N/A"}
            </div>
          </div>

          {/* Coupon Code Highlight */}
          <div className="rounded-xl border-2 border-dashed border-purple-300 bg-gradient-to-r from-blue-50 to-purple-50 p-6 text-center">
            <p className="mb-2 text-sm text-gray-600">Coupon Code</p>
            <div className="font-mono text-3xl font-bold tracking-wider text-purple-700">
              {coupon?.code || "N/A"}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center rounded-xl bg-gray-50 p-4">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-semibold text-gray-800">
                    {coupon?.categories?.map((category) => category.name) ||
                      "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center rounded-xl bg-gray-50 p-4">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-5 w-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    {coupon?.status?.charAt(0).toUpperCase() +
                      coupon?.status?.slice(1) || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center rounded-xl bg-gray-50 p-4">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                  <svg
                    className="h-5 w-5 text-orange-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Real Uses</p>
                  <p className="font-semibold text-gray-800">
                    {coupon?.realUses?.toLocaleString() || "0"}
                  </p>
                </div>
              </div>

              <div className="flex items-center rounded-xl bg-gray-50 p-4">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <svg
                    className="h-5 w-5 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Display Uses</p>
                  <p className="font-semibold text-gray-800">
                    {coupon?.fakeUses?.toLocaleString() || "0"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Store</p>
              <p className="font-semibold text-gray-800">
                {coupon?.store?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Applicable Countries</p>
              <p className="font-semibold text-gray-800">
                {coupon?.countries?.map((c) => c.toUpperCase()).join(", ") ||
                  "N/A"}
              </p>
            </div>

            {/* How to Use and Terms */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">How to Use</p>
                <ul className="list-disc pl-5 font-semibold text-gray-800">
                  {coupon?.howToUse?.map((step, index) => (
                    <li key={index}>{step}</li>
                  )) || <li>N/A</li>}
                </ul>
              </div>
              <div>
                <p className="text-sm text-gray-500">Terms</p>
                <ul className="list-disc pl-5 font-semibold text-gray-800">
                  {coupon?.terms?.map((term, index) => (
                    <li key={index}>{term}</li>
                  )) || <li>N/A</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
