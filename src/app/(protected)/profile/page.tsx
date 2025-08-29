"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Users,
  Edit2,
  Camera
} from "lucide-react";
import Navbar from "@/components/navbar";
import ChangePasswordForm from "@/components/forms/change-password-form";
import ProfileForm from "@/components/forms/profile-form";
import { RootState } from "@/store/store";
import { useAppSelector } from "@/store/hook";

export default function Page() {

  const user = useAppSelector((state: RootState) => state.auth.user);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
                      <Button variant="outline">
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit profile
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h1 className="text-2xl font-bold">{user?.first_name} {user?.last_name}</h1>
                    <p className="text-lg text-foreground mt-1">{user?.bio || 'Bio...'}</p>
                    <p className="text-muted-foreground mt-2">
                      {user?.about || 'Somthing about yourself...'}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        San Francisco, CA
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        500+ connections
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-xl font-semibold">Change your password</h2>
              </CardHeader>
              <CardContent>
                <ChangePasswordForm />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-xl font-semibold">Update Profile</h2>
              </CardHeader>
              <CardContent>
                <ProfileForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};