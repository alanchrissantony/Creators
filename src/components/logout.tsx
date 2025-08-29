"use client"

import { useLogoutAdminMutation } from "@/store/api/adminAuthApi";
import { clearAdmin } from "@/store/slice/adminSliceAuth";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { LogOut } from "lucide-react";

function Logout() {
    const router = useRouter()
    const dispatch = useDispatch()
    const [logout] = useLogoutAdminMutation();


    const handleLogout = async () => {
        try {
            await logout().unwrap();
            dispatch(clearAdmin());
            toast({ title: "Logged out", description: "You have been logged out." });
            router.push("/login");
        } catch (error: any) {
            toast({
                title: "Logout failed",
                description: error?.data?.message || "Something went wrong.",
                variant: "destructive",
            });
        }
    };
    return (
        <Avatar className="h-8 w-8" onClick={handleLogout}>
            <AvatarFallback><LogOut/></AvatarFallback>
        </Avatar>
    )
}

export default Logout