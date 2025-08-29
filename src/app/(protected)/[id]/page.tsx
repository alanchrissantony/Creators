"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, Camera } from "lucide-react";
import Navbar from "@/components/navbar";
import { useGetUserByIdQuery, userApi, useToggleFollowMutation } from "@/store/api/userApi";
import { useParams } from "next/navigation";
import Post from "@/components/post";
import { useDispatch } from "react-redux";

export default function Page() {
  const dispatch = useDispatch();
  const params = useParams();
  const userId = params.id;

  // Fetch user by ID
  const { data: user, isLoading, error } = useGetUserByIdQuery(userId);

  const [toggleFollow] = useToggleFollowMutation();

  const handleToggleFollow = async (userId: string) => {
    try {
      const result = await toggleFollow(userId).unwrap();

      // Update getUserById cache
      dispatch(
        userApi.util.updateQueryData("getUserById", userId, (draft) => {
          draft.followed_by_user = result.followed;
          draft.followers_count += result.followed ? 1 : -1;
        })
      );

      // Update getAllUsers cache if it exists
      dispatch(
        userApi.util.updateQueryData("getAllUsers", undefined, (draft) => {
          const u = draft.find((u) => u.id === userId);
          if (u) {
            u.followed_by_user = result.followed;
            u.followers_count += result.followed ? 1 : -1;
          }
        })
      );
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <Card>
              <div className="relative">
                <div className="h-48 bg-gradient-to-r from-success/20 to-success/10 rounded-t-lg relative">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-4 right-4 bg-background/80 hover:bg-background"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="px-6 pb-6">
                  <div className="flex items-start -mt-16">
                    <Avatar className="h-32 w-32 border-4 border-background">
                      {user?.avatar ? (
                        <AvatarImage src={user.avatar} alt={`${user.first_name} avatar`} />
                      ) : (
                        <AvatarFallback className="text-3xl">
                          {user?.first_name?.[0] || "UR"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex gap-2 ml-auto mt-20">
                      <Button
                        variant={user?.followed_by_user ? "secondary" : "default"}
                        onClick={() => handleToggleFollow(userId)}
                      >
                        {user?.followed_by_user ? "Unfollow" : "Follow"}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h1 className="text-2xl font-bold">
                      {user?.first_name} {user?.last_name}
                    </h1>
                    <p className="text-lg text-foreground mt-1">{user?.bio || "Bio..."}</p>
                    <p className="text-muted-foreground mt-2">{user?.about || "Something about yourself..."}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        San Francisco, CA
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {user?.followers_count} followers
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Post />
          </div>
        </div>
      </main>
    </div>
  );
}
