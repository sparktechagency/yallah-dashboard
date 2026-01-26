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
    deletePopUp: builder.mutation({
      query: (id) => ({
        url: `/popups/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PopUps"],
    }),
  }),
});

export const {
  useGetPopUpsQuery,
  useAddPopUpMutation,
  useDeletePopUpMutation,
} = PopUpApi;
