const { baseApi } = require("./baseApi");

const thumbnailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add banner
    addthumbnails: builder.mutation({
      query: (data) => ({
        url: "/thumbnails",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["thumbnails"],
    }),
    // Get all banners
    getAllthumbnails: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/thumbnails?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["thumbnails"],
    }),
    // Delete banner
    deletethumbnails: builder.mutation({
      query: (thumbnailId) => ({
        url: `/thumbnails/${thumbnailId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["thumbnails"],
    }),
    // Update banner
    updatethumbnails: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/thumbnails/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["thumbnailss"],
    }),
  }),
});

export const {
  useAddthumbnailsMutation,
  useGetAllthumbnailsQuery,
  useDeletethumbnailsMutation,
  useUpdatethumbnailsMutation,
} = thumbnailsApi;
