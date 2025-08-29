"use client";

import { useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Camera } from "lucide-react";
import { useUpdateUserByIdMutation } from "@/store/api/userApi";
import { useDispatch } from "react-redux";
import { updateUser } from "@/store/slice/userSlice";
import { useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";


function AvatarUploader({
  avatarFile,
  setAvatarFile,
}: {
  avatarFile: File | null;
  setAvatarFile: (file: File) => void;
}) {
  const [isHover, setIsHover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  return (
    <div
      className="relative w-32 h-32 cursor-pointer"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={handleAvatarClick}
    >
      <Avatar className="h-32 w-32 border-4 border-background">
        {avatarFile ? (
          <AvatarImage
            src={URL.createObjectURL(avatarFile)}
            alt="Avatar preview"
            className={`transition duration-300 ${isHover ? "blur-sm" : ""}`}
          />
        ) : (
          <AvatarFallback className="text-3xl">USR</AvatarFallback>
        )}
      </Avatar>

      {isHover && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-full">
          <Camera className="w-6 h-6 text-white" />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleAvatarChange}
      />
    </div>
  );
}

function ProfileForm() {
  
  const dispatch = useDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  

  const [formData, setFormData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    bio: user?.bio || "",
    about: user?.about || "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [updateUserById, { isLoading }] = useUpdateUserByIdMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    if (!user) return;

    try {
      const data = new FormData();
      data.append("first_name", formData.firstName);
      data.append("last_name", formData.lastName);
      data.append("bio", formData.bio);
      data.append("about", formData.about);
      if (avatarFile) data.append("avatar", avatarFile);
      const updatedUser = await updateUserById({ userId: user.id, data }).unwrap();
      dispatch(updateUser(updatedUser));

      toast({ title: "Profile updated!" });
    } catch (err) {
      toast({
        title: "Update failed",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-center">
        <AvatarUploader avatarFile={avatarFile} setAvatarFile={setAvatarFile} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          name="firstName"
          type="text"
          placeholder="Enter your first name"
          value={formData.firstName}
          onChange={handleInputChange}
          maxLength={25}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Enter your last name"
          value={formData.lastName}
          onChange={handleInputChange}
          maxLength={25}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Input
          id="bio"
          name="bio"
          type="text"
          placeholder="Bio..."
          value={formData.bio}
          onChange={handleInputChange}
          maxLength={50}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="about">About</Label>
        <Textarea
          id="about"
          name="about"
          placeholder="About yourself..."
          value={formData.about}
          onChange={handleInputChange}
          required
        />
      </div>

      <p className="text-xs text-muted-foreground">
        By clicking Continue, you agree to the Creator User Agreement, Privacy Policy, and Cookie Policy.
      </p>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Continue"}
      </Button>
    </form>
  );
}

export default ProfileForm;
