import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/base-query";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["AdminStats", "AdminPosts"],
  endpoints: (builder) => ({
    getUserStats: builder.query<any, void>({
      query: () => ({
        url: "admin/users/",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["AdminStats"],
    }),
    getPostStats: builder.query<any, void>({
      query: () => ({
        url: "admin/posts/",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["AdminPosts"],
    }),
    getDashStats: builder.query<any, void>({
      query: () => ({
        url: "admin/stats/",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["AdminPosts"],
    }),
  }),
});

export const {
  useGetUserStatsQuery,
  useGetPostStatsQuery,
  useGetDashStatsQuery,
} = adminApi;
