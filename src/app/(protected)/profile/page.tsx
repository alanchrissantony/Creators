import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  Edit2,
  Plus,
  Camera
} from "lucide-react";
import Navbar from "@/components/navbar";
import SignupForm from "@/components/forms/signup-form";

export default function Page() {
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
                      <AvatarFallback className="text-3xl">JD</AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2 ml-auto mt-20">
                      <Button variant="outline">
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit profile
                      </Button>
                      <Button className="bg-success hover:bg-success/90">
                        Follow
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h1 className="text-2xl font-bold">John Doe</h1>
                    <p className="text-lg text-foreground mt-1">Senior Software Engineer at Tech Corp</p>
                    <p className="text-muted-foreground mt-2">
                      Passionate about building scalable web applications and mentoring junior developers
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
                <SignupForm/>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
};