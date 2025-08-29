"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    MoreHorizontal,
    ThumbsUp,
    MessageCircle,
    Repeat2,
    Send
} from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useListPostsQuery, useToggleLikePostMutation, postsApi, useListPostsByUserQuery } from "@/store/api/postsApi";
import { useDispatch, useSelector } from "react-redux";
import { useCreateCommentMutation, useDeleteCommentMutation } from "@/store/api/commentsApi";
import { setComments } from "@/store/slice/commentsSlice";
import { RootState } from "@/store/store";



export default function Post() {
    const dispatch = useDispatch();
    
    const { data: posts = [], isLoading, isError } = useListPostsQuery({ page: 1, pageSize: 10 });
    
    const [toggleLikePost] = useToggleLikePostMutation();

    const commentsByPost = useSelector((state: RootState) => state.comments.byPost);

    const [createComment] = useCreateCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();

    const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
    const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

    const handleToggleComments = (postId: string) => {
        setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    

    const handleToggleLike = async (postId: string) => {
        try {
            const result = await toggleLikePost(postId).unwrap();
            dispatch(
                postsApi.util.updateQueryData("listPosts", { page: 1, pageSize: 10 }, (draft) => {
                    const post = draft.find((p) => p.id === postId);
                    if (post) {
                        post.like_count = result.like_count;
                        post.liked_by_user = result.liked;
                    }
                })
            );
        } catch (err) {
            console.error("Failed to toggle like:", err);
        }
    };

    const handleAddComment = async (postId: string) => {
        const text = commentText[postId];
        if (text && text.trim()) {
            try {
                const newComment = await createComment({
                    postId,
                    content: text.trim()
                }).unwrap();

                dispatch(setComments({ postId, comments: [...(commentsByPost[postId] || []), newComment] }));
                setCommentText(prev => ({ ...prev, [postId]: "" }));
            } catch (error) {
                console.log("Failed to create comment:", error);
            }
        }
    };

    const handleDeleteComment = async (postId: string, commentId: string) => {
        try {
            await deleteComment({ postId, commentId }).unwrap();
            dispatch(
                setComments({
                    postId,
                    comments: commentsByPost[postId].filter((c) => c.id !== commentId)
                })
            );
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Failed to load posts.</p>;

    return (
        <>
            {posts
                .filter((post) => post.is_active) 
                .map((post) => (
                    <Card key={post.id}>
                        <CardContent className="p-4">
                            {/* Post Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex gap-3">
                                    {/* User Avatar */}
                                    <Avatar className="h-12 w-12">
                                        {post.user.avatar ? (
                                            <AvatarImage src={post.user.avatar} alt={post.user.username} />
                                        ) : (
                                            <AvatarFallback>{post.user.username[0]?.toUpperCase() || "U"}</AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div>
                                        <h4 className="font-semibold">
                                            {post.user.first_name} {post.user.last_name}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">{post.user.bio}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Post Content */}
                            <div className="mt-4">
                                {post?.image && (
                                    <img src={post.image} alt="post" className="rounded-lg max-h-96 object-cover" />
                                )}
                                <p className="text-sm whitespace-pre-wrap mt-2">{post.content}</p>
                            </div>

                            {/* Post Stats */}
                            <div className="flex items-center gap-1 mt-4 text-xs text-muted-foreground">
                                <ThumbsUp className="h-3 w-3" />
                                <span>{post.like_count}</span>
                                <span className="mx-1">•</span>
                                <button
                                    onClick={() => handleToggleComments(post.id)}
                                    className="hover:text-foreground transition-colors"
                                >
                                    {(commentsByPost[post.id]?.length || post.comments?.length || 0)} comments
                                </button>
                            </div>

                            <Separator className="my-3" />

                            {/* Action Buttons */}
                            <div className="flex items-center justify-around">
                                <Button
                                    variant={post.liked_by_user ? "default" : "ghost"}
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => handleToggleLike(post.id)}
                                >
                                    <ThumbsUp className="h-4 w-4" />
                                    {post.liked_by_user ? "Liked" : "Like"} ({post.like_count})
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => handleToggleComments(post.id)}
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    Comment
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <Repeat2 className="h-4 w-4" />
                                    Repost
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <Send className="h-4 w-4" />
                                    Send
                                </Button>
                            </div>

                            {/* Comments Section */}
                            {showComments[post.id] && (
                                <>
                                    <Separator className="my-3" />
                                    <div className="space-y-3">
                                        {/* Add Comment */}
                                        <div className="flex gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>ME</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 flex gap-2">
                                                <Textarea
                                                    placeholder="Add a comment..."
                                                    value={commentText[post.id] || ""}
                                                    onChange={(e) =>
                                                        setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))
                                                    }
                                                    className="min-h-[60px] resize-none"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleAddComment(post.id);
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAddComment(post.id)}
                                                    disabled={!commentText[post.id]?.trim()}
                                                >
                                                    Post
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Show Comments (API + Redux merged) */}
                                        <div className="space-y-3 mt-4">
                                            {[...(post.comments || []), ...(commentsByPost[post.id] || [])].map((comment) => (
                                                <div key={comment.id} className="flex gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        {comment.user.avatar ? (
                                                            <AvatarImage src={comment.user.avatar} alt={comment.user.username} />
                                                        ) : (
                                                            <AvatarFallback>{comment.user.username[0]?.toUpperCase()}</AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <div className="bg-muted/50 rounded-lg p-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium">{comment.user.username}</span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    • {new Date(comment.created_at).toLocaleTimeString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm mt-1">{comment.content}</p>
                                                        </div>
                                                        <div className="flex gap-4 mt-1 ml-3">
                                                            <button className="text-xs text-muted-foreground hover:text-foreground">Like</button>
                                                            <button
                                                                className="text-xs text-muted-foreground hover:text-foreground"
                                                                onClick={() => handleDeleteComment(post.id, comment.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
        </>
    )
}
