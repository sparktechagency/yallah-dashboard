const { baseApi } = require("./baseApi");

const pushNotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendPushNotification: builder.mutation({
      query: (data) => ({
        url: "/notifications/send-alert",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["alert"],
    }),
    getPushNotification: builder.query({
      query: () => ({
        url: "/notifications/alerts",
        method: "GET",
      }),
      providesTags: ["alert"],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/alerts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["alert"],
    }),
  }),
});

export const {
  useSendPushNotificationMutation,
  useGetPushNotificationQuery,
  useDeleteNotificationMutation,
} = pushNotificationApi;
