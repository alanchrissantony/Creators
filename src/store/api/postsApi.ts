import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/base-query";

export interface Post {
    id: string;
    user: { username: string };
    content: string;
    image?: string;
    category: "general" | "announcement" | "question";
    like_count: number;
    comment_count: number;
    created_at: string;
    updated_at: string;
}

export interface CreatePostRequest {
    content?: string;
    image?: any; // FormData
    category?: "general" | "announcement" | "question";
}

export const postsApi = createApi({
    reducerPath: "postsApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Post"],
    endpoints: (builder) => ({
        createPost: builder.mutation<Post, FormData>({
            query: (formData) => ({
                url: "posts/create/",
                method: "POST",
                body: formData,
                credentials: "include",
            }),
            invalidatesTags: ["Post"],
        }),

        getPost: builder.query<Post, string>({
            query: (id) => ({
                url: `posts/${id}/`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: (result, error, id) => [{ type: "Post", id }],
        }),

        updatePost: builder.mutation<Post, { id: string; formData: FormData }>({
            query: ({ id, formData }) => ({
                url: `posts/${id}/update/`,
                method: "PUT",
                body: formData,
                credentials: "include",
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
        }),

        deletePost: builder.mutation<void, string>({
            query: (id) => ({
                url: `posts/${id}/delete/`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Post"],
        }),

        listPosts: builder.query<Post[], { page?: number; pageSize?: number }>({
            query: ({ page = 1, pageSize = 10 } = {}) => ({
                url: `posts/?page=${page}&page_size=${pageSize}`,
                method: "GET",
                credentials: "include",
            }),
            transformResponse: (response: { results: Post[] }) => response.results,
            providesTags: ["Post"],
        }),
        toggleLikePost: builder.mutation<{ like_count: number; liked: boolean }, string>({
            query: (postId) => ({
                url: `posts/${postId}/like/`,
                method: "POST",
                credentials: "include",
            }),
            invalidatesTags: (result, error, postId) => [{ type: "Post", id: postId }],
        }),
    }),
});

export const {
    useCreatePostMutation,
    useGetPostQuery,
    useUpdatePostMutation,
    useDeletePostMutation,
    useListPostsQuery,
    useToggleLikePostMutation,
} = postsApi;
