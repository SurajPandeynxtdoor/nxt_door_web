"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendOTP, verifyOTP } from "@/store/slices/AuthSlice";
import { Toaster, toast } from "sonner";
import Image from "next/image";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const LoginModal = ({ isOpen, onOpenChange }: LoginModalProps) => {
  const dispatch = useAppDispatch();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetOtp = async () => {
    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsLoading(true);
    try {
      await dispatch(sendOTP(phone)).unwrap();
      toast.success("OTP sent successfully!");
      setOtpSent(true);
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    setIsLoading(true);
    try {
      await dispatch(verifyOTP({ phone, otp })).unwrap();
      toast.success("Login successful!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Invalid OTP or login failed. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setPhone("");
        setOtp("");
        setOtpSent(false);
      }, 300);
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <Dialog open={isOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-[425px] p-8 rounded-lg shadow-lg">
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <Image
                src="/images/NXTDoor.jpeg"
                alt="NXTDoor Logo"
                className="h-12 w-auto"
                width={200}
                height={200}
              />
            </div>
            <DialogTitle className="text-2xl font-bold text-center mb-4">
              Login/ Signup
            </DialogTitle>
          </DialogHeader>

          {!otpSent ? (
            <div className="space-y-6">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  +91
                </span>
                <Input
                  id="phone"
                  placeholder="Mobile number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  className="pl-12 h-12 text-base"
                />
              </div>
              <p className="text-xs text-center text-gray-500 px-4">
                By continuing, you agree to NxtDoor&apos;s{" "}
                <a href="/terms" className="text-cyan-600 hover:underline">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-cyan-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
              <Button
                onClick={handleGetOtp}
                disabled={isLoading || phone.length !== 10}
                className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-base"
              >
                {isLoading ? "Sending OTP..." : "Login with OTP"}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-center text-gray-600">
                Enter the OTP sent to <strong>+91 {phone}</strong>
                <button
                  onClick={() => setOtpSent(false)}
                  className="ml-2 text-sm text-cyan-600 font-semibold hover:underline"
                >
                  Edit
                </button>
              </p>
              <Input
                id="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="h-12 text-center text-lg tracking-[0.3em]"
              />
              <Button
                onClick={handleLogin}
                disabled={isLoading || otp.length !== 6}
                className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-base"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
              <p className="text-sm text-center text-gray-500">
                Didn&apos;t receive the OTP?{" "}
                <button
                  onClick={handleGetOtp}
                  disabled={isLoading}
                  className="text-cyan-600 font-semibold disabled:text-gray-400"
                >
                  Resend OTP
                </button>
              </p>
            </div>
          )}

          <DialogClose asChild>
            <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none">
              <span className="sr-only">Close</span>
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginModal;
