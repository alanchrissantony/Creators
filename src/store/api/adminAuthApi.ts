// store/api/adminAuthApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/base-query";
import type { LoginRequest } from "@/types/user";

export const adminAuthApi = createApi({
  reducerPath: "adminAuthApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["AdminAuth"],
  endpoints: (builder) => ({
    loginAdmin: builder.mutation<{ admin: unknown; message?: string }, LoginRequest>({
      query: (body) => ({
        url: "auth/admin/login/",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["AdminAuth"],
    }),

    logoutAdmin: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "auth/admin/logout/",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["AdminAuth"],
    }),
  }),
});

export const { useLoginAdminMutation, useLogoutAdminMutation } = adminAuthApi;
