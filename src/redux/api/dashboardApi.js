import { baseApi } from "./baseApi";

const dashBoardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: (params) => ({
        url: "/summaries",
        params, // year OR weekStartDate
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashBoardApi;
