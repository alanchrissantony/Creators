import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/base-query";
import type { LoginRequest, RegisterRequest, VerifyOTPRequest, ResendOTPRequest } from "@/types/user";


export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    register: builder.mutation<{ message: string }, RegisterRequest>({
      query: (body) => ({
        url: "auth/register/",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Auth"],
    }),

    login: builder.mutation<{ message: string }, LoginRequest>({
      query: (body) => ({
        url: "auth/login/",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "auth/logout/",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Auth"],
    }),

    verifyOTP: builder.mutation<{ message: string }, VerifyOTPRequest>({
      query: (body) => ({
        url: "auth/verify/",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),

    resendOTP: builder.mutation<{ message: string }, ResendOTPRequest>({
      query: (body) => ({
        url: "auth/resend/",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
} = authApi;
