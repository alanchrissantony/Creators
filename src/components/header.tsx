"use client";
import { useState, useRef } from "react";
import { useAppDispatch } from "@/store/hook";
import { useCreatePostMutation } from "@/store/api/postsApi";
import { addPost } from "@/store/slice/postsSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Image, Calendar, FileText } from "lucide-react";

export default function Header() {
  const [postText, setPostText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const [createPost, { isLoading }] = useCreatePostMutation();

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handlePostSubmit = async () => {
    if (!postText && !imageFile) return;

    const formData = new FormData();
    formData.append("content", postText);
    if (imageFile) formData.append("image", imageFile);

    try {
      setUploading(true);
      const post = await createPost(formData).unwrap(); // RTK Query mutation
      console.log("Post created:", post);

      // Optional: update local slice immediately
      dispatch(addPost(post));

      setPostText("");
      setImageFile(null);
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="post"
                className="mb-2 rounded"
              />
            )}
            <Input
              placeholder="Start a post"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="rounded-full h-12"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-4">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handlePhotoClick}
              disabled={uploading || isLoading}
            >
              <Image className="h-5 w-5 text-blue-500" />
              <span className="text-sm">
                {imageFile ? imageFile.name : "Photo"}
              </span>
            </Button>

            <Button variant="ghost" size="sm" className="gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <span className="text-sm">Event</span>
            </Button>

            <Button variant="ghost" size="sm" className="gap-2">
              <FileText className="h-5 w-5 text-red-500" />
              <span className="text-sm">Write article</span>
            </Button>
          </div>

          <Button
            size="sm"
            onClick={handlePostSubmit}
            disabled={uploading || isLoading || (!postText && !imageFile)}
          >
            {uploading || isLoading ? "Posting..." : "Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
