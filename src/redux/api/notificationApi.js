import { baseApi } from "./baseApi";

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotification: builder.query({
      query: (query) => ({
        url: `/notifications`,
        method: "GET",
        params: query,
      }),
      providesTags: ["notification"],
      transformResponse: (response) => {
        return {
          data: response?.data,
          meta: response?.meta,
        };
      },
    }),
    markAsRead: builder.mutation({
      query: () => ({
        url: `/notifications/mark-all-as-read`,
        method: "PATCH",
      }),
      invalidatesTags: ["notification"],
    }),
    deleteNotification: builder.mutation({
      query: () => ({
        url: `/notifications`,
        method: "DELETE",
      }),
      invalidatesTags: ["notification"],
    }),
    deleteSingleNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notification"],
    }),

    // get unread notification
    getUnreadNotification: builder.query({
      query: () => ({
        url: `/notifications/unread-count`,
        method: "GET",
      }),
      providesTags: ["notification"],
    }),
  }),
});

export const {
  useGetMyNotificationQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteSingleNotificationMutation,
  useGetUnreadNotificationQuery,
} = notificationApi;
