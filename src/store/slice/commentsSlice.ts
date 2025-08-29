import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Comment } from "@/store/api/commentsApi";

interface CommentsState {
  byPost: {
    [postId: string]: Comment[];
  };
}

const initialState: CommentsState = {
  byPost: {},
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setComments: (
      state,
      action: PayloadAction<{ postId: string; comments: Comment[] }>
    ) => {
      state.byPost[action.payload.postId] = action.payload.comments;
    },
    addComment: (
      state,
      action: PayloadAction<{ postId: string; comment: Comment }>
    ) => {
      if (!state.byPost[action.payload.postId]) {
        state.byPost[action.payload.postId] = [];
      }
      state.byPost[action.payload.postId].unshift(action.payload.comment);
    },
    removeComment: (
      state,
      action: PayloadAction<{ postId: string; commentId: string }>
    ) => {
      if (state.byPost[action.payload.postId]) {
        state.byPost[action.payload.postId] = state.byPost[
          action.payload.postId
        ].filter((c) => c.id !== action.payload.commentId);
      }
    },
  },
});

export const { setComments, addComment, removeComment } =
  commentsSlice.actions;
export default commentsSlice.reducer;
