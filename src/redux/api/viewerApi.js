const { baseApi } = require("./baseApi");

const ViewerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getviewers: builder.query({
      query: (id) => ({
        url: `/viewers`,
        method: "GET",
      }),
      providesTags: ["viewers", "editor"],
    }),
    addModaretor: builder.mutation({
      query: (data) => ({
        url: "/auth/moderators/signup",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["viewers"],
    }),
    deleteViewer: builder.mutation({
      query: (id) => ({
        url: `/editors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["viewers"],
    }),
    updateEditor: builder.mutation({
      query: ({ id, data }) => ({
        url: `/editors/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["editor"],
    }),
  }),
});

export const {
  useGetviewersQuery,
  useAddModaretorMutation,
  useDeleteViewerMutation,
  useUpdateEditorMutation,
} = ViewerApi;
