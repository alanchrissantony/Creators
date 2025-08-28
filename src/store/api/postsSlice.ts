import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "@/store/api/postsApi";

interface PostsState {
  posts: Post[];
  currentPost: Post | null;
}

const initialState: PostsState = {
  posts: [],
  currentPost: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    setCurrentPost: (state, action: PayloadAction<Post>) => {
      state.currentPost = action.payload;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
  },
});

export const { setPosts, setCurrentPost, addPost, removePost } =
  postsSlice.actions;
export default postsSlice.reducer;
