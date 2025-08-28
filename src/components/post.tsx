"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { useListPostsQuery, useToggleLikePostMutation } from "@/store/api/postsApi";

export default function Post() {

    const { data: posts = [], isLoading, isError } = useListPostsQuery({ page: 1, pageSize: 10 });
    const [toggleLikePost] = useToggleLikePostMutation();
    const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

    const handleToggleLike = async (postId: string) => {
        try {
            const result = await toggleLikePost(postId).unwrap();
            setLikedPosts(prev => ({ ...prev, [postId]: result.liked }));
        } catch (err) {
            console.error("Failed to toggle like:", err);
        }
    };

    const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
    const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
    const [postComments, setPostComments] = useState<{ [key: string]: Array<{ id: number; author: string; text: string; time: string }> }>({});



    const handleAddComment = (postId: number) => {
        const text = commentText[postId];
        if (text && text.trim()) {
            const newComment = {
                id: Date.now(),
                author: "You",
                text: text.trim(),
                time: "now"
            };
            setPostComments(prev => ({
                ...prev,
                [postId]: [...(prev[postId] || []), newComment]
            }));
            setCommentText(prev => ({ ...prev, [postId]: "" }));
        }
    };

    const toggleComments = (postId: number) => {
        setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    };
    return (
        <>
            {posts.map((post) => (
                <Card key={post.id}>
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback>{post.user}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-semibold">{post.user.first_name}</h4>
                                    <p className="text-sm text-muted-foreground">{post.user.bio}</p>
                                    <p className="text-xs text-muted-foreground">{post.created_at}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="mt-4">
                            {post?.image && <img src={post.image} alt="post" />}
                            <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                        </div>

                        <div className="flex items-center gap-1 mt-4 text-xs text-muted-foreground">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{post.like_count}</span>
                            <span className="mx-1">•</span>
                            <button
                                onClick={() => toggleComments(post.id)}
                                className="hover:text-foreground transition-colors"
                            >
                                {postComments[post.id]?.length || 0} comments
                            </button>
                            <span className="mx-1">•</span>
                            <span>0 reposts</span>
                        </div>

                        <Separator className="my-3" />

                        <div className="flex items-center justify-around">
                            <Button
                                variant={likedPosts[post.id] ? "default" : "ghost"}
                                size="sm"
                                className="gap-2"
                                onClick={() => handleToggleLike(post.id)}
                            >
                                <ThumbsUp className="h-4 w-4" />
                                {likedPosts[post.id] ? "Liked" : "Like"} ({post.like_count})
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2"
                                onClick={() => toggleComments(post.id)}
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
                                    {/* Add Comment Input */}
                                    <div className="flex gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>ME</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 flex gap-2">
                                            <Textarea
                                                placeholder="Add a comment..."
                                                value={commentText[post.id] || ""}
                                                onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                className="min-h-[60px] resize-none"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
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

                                    {/* Display Comments */}
                                    {postComments[post.id]?.length > 0 && (
                                        <div className="space-y-3 mt-4">
                                            {postComments[post.id].map((comment) => (
                                                <div key={comment.id} className="flex gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>{comment.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <div className="bg-muted/50 rounded-lg p-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium">{comment.author}</span>
                                                                <span className="text-xs text-muted-foreground">• {comment.time}</span>
                                                            </div>
                                                            <p className="text-sm mt-1">{comment.text}</p>
                                                        </div>
                                                        <div className="flex gap-4 mt-1 ml-3">
                                                            <button className="text-xs text-muted-foreground hover:text-foreground">Like</button>
                                                            <button className="text-xs text-muted-foreground hover:text-foreground">Reply</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            ))}
        </>
    )
}