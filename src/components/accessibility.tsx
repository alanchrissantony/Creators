"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { UserCheck } from "lucide-react";
import { Badge } from "./ui/badge";
import { useGetAllUsersQuery } from "@/store/api/userApi";
import Link from "next/link";

export default function Accessibility() {
    const { data: users, isLoading } = useGetAllUsersQuery();

    return (
        <aside className="col-span-3 space-y-4">
            <CardContent>
                <div className="max-h-[400px] overflow-y-auto overflow-x-hidden scrollbar-hide">
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users?.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Link href={`/${user.id}`}>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={user.avatar} />
                                                    <AvatarFallback>{user?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-foreground">{user?.name}</p>
                                                        <Badge variant="outline" className="h-5 px-1">
                                                            <UserCheck className="h-3 w-3" />
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </aside>
    )
}
