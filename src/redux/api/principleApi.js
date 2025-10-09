const { baseApi } = require('./baseApi');

const principleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPrinciples: build.query({
      query: ({ limit, page, searchText }) => ({
        url: `/principals?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: 'GET',
      }),
      providesTags: ['Principles', 'user'],
    }),
    getPrincipleById: build.query({
      query: (id) => ({
        url: `/principles/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Principles', id }],
    }),
    createPrinciple: build.mutation({
      query: (newPrinciple) => ({
        url: '/principals',
        method: 'POST',
        body: newPrinciple,
      }),
      invalidatesTags: ['Principles'],
    }),
    updatePrinciple: build.mutation({
      query: ({ id, ...updatedFields }) => ({
        url: `/principles/${id}`,
        method: 'PUT',
        body: updatedFields,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Principles', id }],
    }),
    deletePrinciple: build.mutation({
      query: (id) => ({
        url: `/principles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Principles', id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPrinciplesQuery,
  useGetPrincipleByIdQuery,
  useCreatePrincipleMutation,
  useUpdatePrincipleMutation,
  useDeletePrincipleMutation,
} = principleApi;
