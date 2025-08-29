"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useVerifyOTPMutation, useResendOTPMutation } from "@/store/api/authApi";

interface OtpFormProps {
  email: string;
}

export default function OtpForm({ email }: OtpFormProps) {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [verifyOTP] = useVerifyOTPMutation();
  const [resendOTP] = useResendOTPMutation();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const data = await verifyOTP({ email, otp }).unwrap();

      toast({
        title: "Email Verified!",
        description: data.message,
      });

      router.push("/");
    } catch (error: unknown) {
      toast({
        title: "Verification failed",
        description: error?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);

    try {
      const data = await resendOTP({ email }).unwrap();

      toast({
        title: "OTP Resent",
        description: data.message,
      });

      setOtp("");
    } catch (error: unknown) {
      toast({
        title: "Failed to resend OTP",
        description: error?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-6">
      <div className="space-y-2 text-center">
        <label className="text-sm font-medium text-foreground">
          Enter verification code
        </label>
        <div className="flex justify-center">
          <InputOTP value={otp} onChange={setOtp} maxLength={6} disabled={isLoading}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isLoading || otp.length !== 6}>
        {isLoading ? "Verifying..." : "Verify Email"}
      </Button>

      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
        <Button
          type="button"
          variant="outline"
          onClick={handleResendOTP}
          disabled={isResending}
          className="gap-2"
        >
          <Mail className="h-4 w-4" />
          {isResending ? "Sending..." : "Resend Code"}
        </Button>
      </div>

      <div className="rounded-lg bg-muted/50 p-4">
        <p className="text-xs text-muted-foreground text-center">
          For security reasons, this code will expire in 10 minutes.
          Please check your spam folder if you don't see the email.
        </p>
      </div>
    </form>
  );
}
