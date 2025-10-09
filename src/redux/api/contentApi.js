import { baseApi } from "./baseApi";

const ContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContents: builder.query({
      query: () => ({ url: `/legal`, method: "GET" }),
      providesTags: ["content"],
    }),
    updateContent: builder.mutation({
      query: (data) => ({ url: `/legal`, method: "PUT", body: data }),
      invalidatesTags: ["content"],
    }),
  }),
});

export const { useGetContentsQuery, useUpdateContentMutation } = ContentApi;
