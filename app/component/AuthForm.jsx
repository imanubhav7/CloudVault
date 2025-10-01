"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { formSchema } from "../lib/schema";
import OTPModal from "./OTPModal";
import { sendOTP, signIn } from "@/action/otp-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
const AuthForm = ({ type }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema(type)),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  // Submit FN 
  async function onSubmit(values) {
    setIsLoading(true);
    setErrorMessage("");
    try {
      if (type === "sign-up") {
        const result = await sendOTP(values.email, values.fullName, type);
        if (result?.success) {
          setUserEmail(values.email);
          setShowOtpModal(true); //
          toast.success(result.message || `OTP sent to ${values.email}`);
        }
      } else {
        const result = await signIn(values.email);

        if (result?.success) {
          toast.success(result.message);
          router.push("/");
        }
      }
    } catch (error) {
      console.error(error);
      //
      if (error.message.includes("already exists")) {
        toast.info("Account already exists, redirecting to Sign In...");
        router.push("/sign-in");
        return;
      }

      if (error.message.includes("not found")) {
        toast.info("No account found, redirecting to Sign Up...");
        router.push("/sign-up");
        return;
      }

      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex max-h-[800px] w-full max-w-[580px] flex-col justify-center space-y-6 transition-all lg:h-full lg:space-y-8"
        >
          <h1 className="form-title">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="p-2 border rounded-lg shadow-drop-1 flex border-light-300 flex-col px-4 justify-center ">
                    <FormLabel className="text-light-100 pt-2 w-full">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full Name"
                        {...field}
                        className="placeholder:text-light-600 border-none shadow-none shad-no-focus"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-red body-2 ml-4" />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="p-2 border rounded-lg shadow-drop-1 flex border-light-300 flex-col px-4 justify-center ">
                  <FormLabel className="text-light-100 pt-2 w-full">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="placeholder:text-light-600 border-none shadow-none shad-no-focus"
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-red body-2 ml-4" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-brand-100 p-8 rounded-full"
            disabled={isLoading}
          >
            {type === "sign-up" ? "Sign Up" : "Sign In"}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                width={20}
                height={20}
                alt="loader"
                className="animate-spin ml-2"
                disabled={isLoading}
              />
            )}
          </Button>

          {errorMessage && (
            <p className="body-2 mx-auto w-fit rounded-xl bg-error/5 px-8 py-4 text-center text-error">
              {errorMessage}
            </p>
          )}

          <div className="flex justify-center body-2">
            <p className="text-light-100">
              {type === "sign-in"
                ? "Don't have an account ?"
                : "Already have an account ?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="ml-1 font-medium text-brand-100"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Form>

      {/* OTP Verification  */}
      {showOtpModal && (
        <OTPModal
          email={userEmail}
          open={showOtpModal}
          onClose={() => setShowOtpModal(false)}
        />
      )}
    </>
  );
};

export default AuthForm;
