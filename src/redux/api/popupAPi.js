const { baseApi } = require("./baseApi");

const PopUpApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPopUps: builder.query({
      query: () => ({
        url: "/popups",
        method: "GET",
      }),
      providesTags: ["PopUps"],
    }),
    addPopUp: builder.mutation({
      query: (data) => ({
        url: "/popups",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PopUps"],
    }),
    // Delete banner
    deletePopUp: builder.mutation({
      query: (thumbnailId) => ({
        url: `/popups/${thumbnailId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PopUps"],
    }),
    updatePopUp: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/popups/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["PopUps"],
    }),
  }),
});

export const {
  useGetPopUpsQuery,
  useAddPopUpMutation,
  useDeletePopUpMutation,
  useUpdatePopUpMutation,
} = PopUpApi;
