import { AdminPublicRoute } from "@/routes/admin-public-route";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: 'Login - Admin'
}

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AdminPublicRoute>
            {children}
        </AdminPublicRoute>
    );
}
