"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home as HomeIcon,
    Users,
    MessageSquare,
    Bell,
} from "lucide-react";


export default function NavbarItems() {

    const pathname = usePathname();

    const navItems = [
        { icon: HomeIcon, label: "Home", href: "/" },
        { icon: Users, label: "Connections", href: "#connections", badge: 3 },
        { icon: MessageSquare, label: "Messaging", href: "#messaging", badge: 1 },
        { icon: Bell, label: "Notifications", href: "#notifications", badge: 7 },
    ];

    return (
        <>
            {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex flex-col items-center gap-1 px-3 py-1 relative cursor-pointer ${isActive
                                ? "text-foreground"
                                : "text-muted-foreground"
                            } hover:text-foreground transition-colors`}
                    >
                        <div className="relative">
                            <item.icon className="h-5 w-5" />
                            {item.badge && (
                                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                    {item.badge}
                                </span>
                            )}
                        </div>
                        <span className="text-xs">{item.label}</span>
                        {isActive && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                        )}
                    </Link>
                );
            })}
        </>
    )
}