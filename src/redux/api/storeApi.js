const { baseApi } = require("./baseApi");

const StoreApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add store
    addStore: builder.mutation({
      query: (data) => ({
        url: "/stores",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["store"],
    }),
    // Get all stores
    getAllStores: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/stores?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["store"],
    }),
    // Delete store
    deleteStore: builder.mutation({
      query: (id) => ({
        url: `/stores/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["store"],
    }),
    // Update store
    updateStore: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/stores/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["store"],
    }),
  }),
});
export const {
  useAddStoreMutation,
  useGetAllStoresQuery,
  useDeleteStoreMutation,
  useUpdateStoreMutation,
} = StoreApi;
