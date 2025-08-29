import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/base-query";
import { addComment, removeComment, setComments } from "@/store/slice/commentsSlice";

export interface Comment {
  id: string;
  post: string;
  user: { username: string };
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentRequest {
  postId: string;
  content: string;
}

// store/api/commentsApi.ts
export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Comment"],
  endpoints: (builder) => ({
    listComments: builder.query<Comment[], string>({
      query: (postId) => ({
        url: `posts/${postId}/comments/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, postId) => [{ type: "Comment", id: postId }],
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Store the comments in the slice when fetched
          dispatch(setComments({ postId, comments: data }));
        } catch (error) {
          console.log("Failed to fetch comments:", error);
        }
      },
    }),

    createComment: builder.mutation<Comment, CreateCommentRequest>({
      query: ({ postId, content }) => ({
        url: `posts/${postId}/comments/create/`,
        method: "POST",
        body: { content },
        credentials: "include",
      }),
      async onQueryStarted({ postId, content }, { dispatch, queryFulfilled }) {
        // Optimistically update both the RTK Query cache and the slice
        const tempId = Math.random().toString(36).substring(7);
        const tempUser = { username: "You" };
        const newComment = {
          id: tempId,
          post: postId,
          user: tempUser,
          content: content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Update RTK Query cache
        const patchResult = dispatch(
          commentsApi.util.updateQueryData(
            "listComments",
            postId,
            (draft) => {
              draft.unshift(newComment);
            }
          )
        );

        // Update the slice
        dispatch(addComment({ postId, comment: newComment }));

        try {
          const { data } = await queryFulfilled;
          // Replace the temporary comment with the real one from the server
          dispatch(
            commentsApi.util.updateQueryData(
              "listComments",
              postId,
              (draft) => {
                const index = draft.findIndex(comment => comment.id === tempId);
                if (index !== -1) {
                  draft[index] = data;
                }
              }
            )
          );
          // Also update the slice
          dispatch(removeComment({ postId, commentId: tempId }));
          dispatch(addComment({ postId, comment: data }));
        } catch {
          // If the mutation fails, revert both updates
          patchResult.undo();
          dispatch(removeComment({ postId, commentId: tempId }));
        }
      },
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comment", id: postId },
      ],
    }),

    deleteComment: builder.mutation<void, { postId: string; commentId: string }>({
      query: ({ postId, commentId }) => ({
        url: `posts/${postId}/comments/${commentId}/delete/`,
        method: "DELETE",
        credentials: "include",
      }),
      async onQueryStarted({ postId, commentId }, { dispatch, queryFulfilled }) {
        // Store the current state for potential rollback
        let previousComments: Comment[] = [];
        
        // Update RTK Query cache
        const patchResult = dispatch(
          commentsApi.util.updateQueryData(
            "listComments",
            postId,
            (draft) => {
              previousComments = [...draft];
              return draft.filter(comment => comment.id !== commentId);
            }
          )
        );

        // Update the slice
        dispatch(removeComment({ postId, commentId }));

        try {
          await queryFulfilled;
        } catch {
          // If the mutation fails, revert both updates
          patchResult.undo();
          dispatch(setComments({ postId, comments: previousComments }));
        }
      },
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comment", id: postId },
      ],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useListCommentsQuery,
  useDeleteCommentMutation,
} = commentsApi;