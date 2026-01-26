const { baseApi } = require("./baseApi");

const categoriesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createCategories: build.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["categories"],
    }),
    getCategories: build.query({
      query: ({ limit, page, searchText }) => ({
        url: `/categories?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["categories"],
    }),
    deleteCategory: build.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categories"],
    }),
    updateCategory: build.mutation({
      query: ({ id, formData }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoriesMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = categoriesApi;
