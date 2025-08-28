import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";


export default function Sidebar() {
    return (
        <aside className="col-span-3">
            <Card>
                <CardContent className="p-0">
                    <div className="h-16 bg-gradient-to-r from-success/20 to-success/10 rounded-t-lg" />
                    <div className="px-4 pb-4">
                        <Avatar className="h-16 w-16 -mt-8 border-4 border-background">
                            <AvatarFallback>ME</AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold mt-4">Welcome back!</h3>
                    </div>
                    <Separator />
                    <div className="p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Connections</span>
                            <span className="text-success font-semibold">82</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Who viewed your profile</span>
                            <span className="text-success font-semibold">21</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </aside>
    )
}