"use client";

import { sendOTP, verifyOtp } from "@/action/otp-action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
// import { sendOtpEmail } from "@/lib/helpers/mailer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const OTPModal = ({ email,open, onClose }) => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0)

   useEffect(() => {
    if (open) setOtp(""); // reset OTP 
  },[open])


//Submit 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
     const { success, message } = await verifyOtp(email, otp);
     if (success) {
        toast.success( message);
        router.push("/");
        
      }
    } catch (error) {
      toast.error(error.message || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  //Resend OTP 

  const handleResendOtp = async () => {
   
    if(resendCooldown> 0) return ;
    setIsLoading(true);
    try{
      await sendOTP(email,"", "resend");
      toast.success(`OTP send to ${email}`)
      setResendCooldown(30)

      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if(prev<=1)
          {
            clearInterval(timer)
            return 0;
          }
          return prev-1 
        })
      },1000)
   } catch (error) {
      console.error("Failed to resend OTP",error)
      toast.error("Failed to resend OTP")
   }
   finally{
    setIsLoading(false)
    setOtp("")
   }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="space-y-4 max-w-[95%] sm:w-fit rounded-xl md:rounded-[30px] px-4 md:px-8 py-10 bg-white outline-none">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Enter Your OTP
            <Image
              src="/assets/icons/close-dark.svg"
              alt="close"
              height={20}
              width={20}
              onClick={() => onClose()}
              className="absolute -right-1 -top-3 cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            We&apos;ve sent a code to{" "}
            <span className="pl-1 text-brand">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup className="w-full flex gap-1 sm:gap-2 justify-between ">
            <InputOTPSlot
              index={0}
              className="text-[40px] font-medium rounded-xl ring-brand shadow-drop-1 text-brand-100 justify-center flex border-2 border-light-300 size-12 md:size-16 gap-5"
            />
            <InputOTPSlot
              index={1}
              className="text-[40px] font-medium rounded-xl ring-brand shadow-drop-1 text-brand-100 justify-center flex border-2 border-light-300 size-12 md:size-16 gap-5"
            />
            <InputOTPSlot
              index={2}
              className="text-[40px] font-medium rounded-xl ring-brand shadow-drop-1 text-brand-100 justify-center flex border-2 border-light-300 size-12 md:size-16 gap-5"
            />
            <InputOTPSlot
              index={3}
              className="text-[40px] font-medium rounded-xl ring-brand shadow-drop-1 text-brand-100 justify-center flex border-2 border-light-300 size-12 md:size-16 gap-5"
            />
            <InputOTPSlot
              index={4}
              className="text-[40px] font-medium rounded-xl ring-brand shadow-drop-1 text-brand-100 justify-center flex border-2 border-light-300 size-12 md:size-16 gap-5"
            />
            <InputOTPSlot
              index={5}
              className="text-[40px] font-medium rounded-xl ring-brand shadow-drop-1 text-brand-100 justify-center flex border-2 border-light-300 size-12 md:size-16 gap-5"
            />
          </InputOTPGroup>
        </InputOTP>
        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-4">
            <AlertDialogAction
              onClick={handleSubmit}
              className="bg-brand button hover:bg-brand-100 transition-all h-12 rounded-full"
              type="button"
             disabled={isLoading}
            >
              Submit
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  height={24}
                  width={24}
                  alt="loader"
                  disabled={isLoading}
                  className="ml-2 animate-spin"
                />
              )}
            </AlertDialogAction>
            <div className="mt-2 text-center text-light-100 subtitle-2">
              Didn't get a code?
              <Button
                className="text-brand border-none pl-1"
                type="button"
                variant="link"
                onClick={handleResendOtp}
                disabled={resendCooldown>0 || isLoading}
              >
                {resendCooldown>0 ? `Resend in ${resendCooldown}`:"Click to resend"}
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OTPModal;
