import { baseApi } from './baseApi';

const districtsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createDristict: build.mutation({
      query: (newDistrict) => ({
        url: '/districts',
        method: 'POST',
        body: newDistrict,
      }),
      invalidatesTags: ['Districts'],
    }),
    getDistricts: build.query({
      query: ({ limit, page, searchText }) => ({
        url: `/districts?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: 'GET',
      }),
      providesTags: ['Districts'],
    }),
    getDistrictById: build.query({
      query: (id) => ({
        url: `/districts/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Districts', id }],
    }),
    deleteDistrict: build.mutation({
      query: (id) => ({
        url: `/districts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Districts'],
    }),

    updateDistrict: build.mutation({
      query: ({ id, formData }) => ({
        url: `/districts/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Districts'],
    }),
  }),
});

export const {
  useGetDistrictsQuery,
  useGetDistrictByIdQuery,
  useCreateDristictMutation,
  useDeleteDistrictMutation,
  useUpdateDistrictMutation,
} = districtsApi;
