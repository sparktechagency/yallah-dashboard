const { baseApi } = require("./baseApi");

const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add banner
    addBanner: builder.mutation({
      query: (data) => ({
        url: "/banners",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["banner"],
    }),
    // Get all banners
    getAllBanners: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/banners?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["banner"],
    }),
    // Delete banner
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["banner"],
    }),
    // Update banner
    updateBanner: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/banners/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["banner"],
    }),
  }),
});

export const {
  useAddBannerMutation,
  useGetAllBannersQuery,
  useDeleteBannerMutation,
  useUpdateBannerMutation,
} = bannerApi;
