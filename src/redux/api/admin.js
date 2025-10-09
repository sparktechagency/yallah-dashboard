import { baseApi } from './baseApi';

const AdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdmin: builder.query({
      query: () => ({
        url: '/admins',
        method: 'GET',
      }),
      providesTags: ['admins'],
    }),
    // upload admin image --
    uploadAdminImage: builder.mutation({
      query: (data) => ({
        url: '/admins/image',
        method: 'PATCH',
        body: data,
      }),
    }),
    // update admin info --
    updateAdminInfo: builder.mutation({
      query: (data) => ({
        url: '/admins',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['admins'],
    }),
  }),
});

export const { useGetAdminQuery, useUploadAdminImageMutation, useUpdateAdminInfoMutation } =
  AdminApi;
