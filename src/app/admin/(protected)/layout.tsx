import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Shield } from "lucide-react";
import AdminSidebar from "@/components/admin-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdminProtectedRoute } from "@/routes/admin-protected-route";
import Logout from "@/components/logout";

export const metadata: Metadata = {
    title: "Dashboard - Admin",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AdminProtectedRoute>
            <div className="min-h-screen bg-background">
                {/* Admin Header */}
                <header className="border-b border-border bg-card">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Shield className="h-6 w-6 text-primary" />
                                <h1 className="text-xl font-semibold text-foreground">
                                    Admin Panel
                                </h1>
                            </div>
                            <div className="flex gap-6">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        <span className="hidden md:block">Back to Home</span>
                                    </Link>
                                </Button>
                                <div className="flex items-center cursor-pointer">
                                    <Logout/>
                                </div>
                            </div>

                        </div>
                    </div>
                </header>

                <div className="flex">
                    {/* Sidebar */}
                    <AdminSidebar />
                    {/* Main Content */}
                    <main className="flex-1">{children}</main>
                </div>
            </div>
        </AdminProtectedRoute>
    );
}
