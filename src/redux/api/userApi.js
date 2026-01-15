import { baseApi } from "./baseApi";

const UserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllusers: builder.query({
      query: ({ limit, page, searchText, searchCountry, createdAt }) => {
        let url = `/users?limit=${limit}&page=${page}&searchTerm=${searchText}`;

        if (searchCountry) {
          url += `&country=${searchCountry}`;
        }

        if (createdAt) {
          url += `&createdAt=${createdAt}`;
        }

        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["user"],
    }),
    getUserById: builder.query({
      query: (id) => ({ url: `/users/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "user", id }],
    }),
    blockUnblockUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["user"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetAllusersQuery,
  useBlockUnblockUserMutation,
  useDeleteUserMutation,
  useGetUserByIdQuery,
} = UserApi;
