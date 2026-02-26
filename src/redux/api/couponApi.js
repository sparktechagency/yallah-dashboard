const { baseApi } = require("./baseApi");

const CpuponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add coupon
    addCoupon: builder.mutation({
      query: (data) => ({
        url: "/coupons",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["coupon"],
    }),
    // Get all coupons
    getAllCoupons: builder.query({
      query: ({ limit, page, searchText, countries, storeId }) => {
        const params = {
          limit,
          page,
        };

        if (searchText) {
          params.searchTerm = searchText;
        }

        if (countries) {
          params.countries = countries;
        }

        if (storeId) {
          params.store = storeId;
        }

        return {
          url: "/coupons",
          method: "GET",
          params,
        };
      },
      providesTags: ["coupon"],
    }),
    // Get coupon by id
    getCouponById: builder.query({
      query: (id) => ({
        url: `/coupons/single/${id}`,
        method: "GET",
      }),
      providesTags: ["coupon"],
    }),
    // Delete coupon
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coupon"],
    }),
    // Update coupon
    updateCoupon: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/coupons/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["coupon"],
    }),

    // get coupon by store id
    getCouponsByStoreId: builder.query({
      query: ({ limit, page, searchText, storeId }) => ({
        url: `/coupons/${storeId}?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["coupon"],
    }),
  }),
});
export const {
  useAddCouponMutation,
  useGetAllCouponsQuery,
  useDeleteCouponMutation,
  useUpdateCouponMutation,
  useGetCouponByIdQuery,
  useGetCouponsByStoreIdQuery,
} = CpuponApi;
