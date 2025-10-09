import { baseApi } from './baseApi';

const schoolApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addSchool: builder.mutation({
      query: (data) => ({
        url: '/schools',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['schools'],
    }),
    getAllSchools: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/schools?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: 'GET',
      }),
      providesTags: ['schools'],
    }),
    deleteSchool: builder.mutation({
      query: (id) => ({
        url: `/schools/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['schools'],
    }),
  }),
});

export const { useGetAllSchoolsQuery, useAddSchoolMutation, useDeleteSchoolMutation } = schoolApi;
