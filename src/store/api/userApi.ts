// store/api/userApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../base-query";
import { User } from "@/types/user";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getAllUsers: builder.query<User[], void>({
            query: () => "users/",
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: "User" as const, id })), { type: "User", id: "LIST" }]
                    : [{ type: "User", id: "LIST" }],
        }),
        getUserById: builder.query<User, string>({
            query: (userId) => `users/${userId}/`,
            providesTags: (result, error, userId) => [{ type: "User", id: userId }],
        }),
        updateUserById: builder.mutation<User, { userId: string; data: FormData }>({
            query: ({ userId, data }) => ({
                url: `users/${userId}/update/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { userId }) => [{ type: "User", id: userId }],
        }),
        changePassword: builder.mutation<void, { userId: string; current_password: string; new_password: string }>({
            query: ({ userId, current_password, new_password }) => ({
                url: `users/${userId}/password/`,
                method: "PUT",
                body: { current_password, new_password },
            }),
        }),
        toggleFollow: builder.mutation<{ followed: boolean }, string>({
            query: (userId) => ({
                url: `users/${userId}/follow/`,
                method: "POST",
                credentials: "include",
            }),
            invalidatesTags: (result, error, userId) => [{ type: "User", id: userId }],
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserByIdMutation,
    useChangePasswordMutation,
    useToggleFollowMutation,
} = userApi;
