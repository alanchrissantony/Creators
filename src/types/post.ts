import { User } from "./user";

export interface UserSummary {
  id: string;
  username: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  user: UserSummary;
  content: string;
  created_at: string;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  image?: string | null;
  category: "general" | "announcement" | "question" | "music";
  like_count: number;
  comment_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  liked_by_user: boolean;
  comments: Comment[];
}

export interface CreatePostRequest {
  content?: string;
  image?: any; // FormData
  category?: "general" | "announcement" | "question" | "music";
}

export interface PostsState {
  posts: Post[];
  currentPost: Post | null;
}