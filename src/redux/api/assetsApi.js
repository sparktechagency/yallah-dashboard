const { baseApi } = require('./baseApi');

const assestApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAssets: build.query({
      query: () => ({
        url: '/assets',
        method: 'GET',
      }),
      providesTags: ['Assets'],
    }),
    getAssetById: build.query({
      query: (id) => ({
        url: `/assets/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Assets', id }],
    }),
    deleteAsset: build.mutation({
      query: (id) => ({
        url: `/assets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Assets'],
    }),

    changeAssetStatus: build.mutation({
      query: ({ id, formData }) => ({
        url: `/assets/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Assets'],
    }),
  }),
});

export const {
  useGetAssetsQuery,
  useGetAssetByIdQuery,
  useDeleteAssetMutation,
  useChangeAssetStatusMutation,
} = assestApi;
