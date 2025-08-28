import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import SignupForm from "@/components/forms/signup-form";
import { Shield } from "lucide-react";

export default function Page() {

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="p-4">
                <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-primary" />
                    <h1 className="text-xl font-semibold text-foreground">
                        Creators
                    </h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl">Sign Up</CardTitle>
                        <CardDescription>
                            Stay updated on your professional world
                        </CardDescription>
                    </CardHeader>
                    <CardContent>

                        <SignupForm />

                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-muted-foreground">
                            Already on Creator?{" "}
                            <Link href="/login" className="text-success hover:underline font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
};