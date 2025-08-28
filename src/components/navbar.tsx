import { Input } from "@/components/ui/input";
import {
    Search,
    Shield
} from "lucide-react";
import ProfileDropDown from "./profile-dropdown";
import NavbarItems from "./navbar-items";
import { Separator } from "./ui/separator";

export default function Navbar() {

    return (
        <header className="bg-background border-b sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-14">
                    {/* Logo + Search */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-3">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search"
                                className="pl-10 w-64 h-9 bg-muted/50"
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center gap-6">
                        <NavbarItems/>

                        <Separator orientation="vertical" className="h-8" />

                        {/* Profile dropdown */}
                        <ProfileDropDown />
                    </nav>
                </div>
            </div>
        </header>
    );
}
