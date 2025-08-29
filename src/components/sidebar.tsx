"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { RootState } from "@/store/store";
import { useAppSelector } from "@/store/hook";



export default function Sidebar() {
    const user = useAppSelector((state: RootState) => state.auth.user);
    return (
        <aside className="col-span-3">
            <Card>
                <CardContent className="p-0">
                    <div className="h-16 bg-gradient-to-r from-success/20 to-success/10 rounded-t-lg" />
                    <div className="px-4 pb-4">
                        <Avatar className="h-16 w-16 -mt-8 border-4 border-background">
                            {user?.avatar ? (
                                <AvatarImage src={user.avatar} alt={`${user.first_name} avatar`} />
                            ) : (
                                <AvatarFallback className="text-3xl">
                                    {user?.first_name?.[0] || "UR"}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <h3 className="font-semibold mt-4">{user?.first_name} {user?.last_name}</h3>
                    </div>
                    <Separator />
                    <div className="p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Followers</span>
                            <span className="text-success font-semibold">{user?.followers_count}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Following</span>
                            <span className="text-success font-semibold">{user?.following_count}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </aside>
    )
}