"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import OtpForm from "@/components/forms/otp-form";
import Link from "next/link";

export default function Page() {
  const email = localStorage.getItem("verificationEmail") || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">

      <header className="p-6">
        <Link href="/signup">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Sign Up
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-2xl border-border/50 backdrop-blur">
          <CardHeader className="text-center space-y-6 pb-4">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
              <CardDescription className="mt-2">
                We've sent a 6-digit verification code to
                <span className="block font-medium text-foreground mt-1">{email}</span>
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <OtpForm email={email} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
