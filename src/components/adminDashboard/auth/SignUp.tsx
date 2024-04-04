"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SignUpSubmitForm } from "@/types/form";
// import { loginUser } from "@/helpers/login";
// import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ConfigData } from "@/types/data";
import { joseFont } from "@/helpers/lib/font";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { AUTH_SIGN_UP_ENDPOINT } from "@/service/endpoints";
import { signUpSchema } from "@/helpers/schemas";
import { Message } from "@/types/enum";

const SignUp = ({ config }: ConfigData) => {
  const allowSignUp = config.some((c) => c.allowSignUp);
  return allowSignUp ? (
    <SignUpComponent />
  ) : (
    <Card>
      <CardContent className="space-y-2  w-96 h-60">
        <div
          className={`${joseFont} fs-400 space-y-1 flex items-center justify-center h-60`}
        >
          Sign up Disable
        </div>
      </CardContent>
    </Card>
  );
};

export default SignUp;

export const SignUpComponent = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      signupEmail: "",
      signupPassword: "",
    },
    resolver: zodResolver(signUpSchema),
  });
  // const router = useRouter();
  const submit = async (formData: SignUpSubmitForm) => {
    try {
      const response = await fetch(AUTH_SIGN_UP_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.signupEmail,
          password: formData.signupPassword,
        }),
      });
      const responseData = await response.json();
      if (responseData?.success) {
        // TODO Verify Email functionality

        // const loginRes = await loginUser({
        //   email: formData.signupEmail,
        //   password: formData.signupPassword,
        // });
        toast.success(Message.USER_CREATED_SUCCESSFULLY);
        reset();
      } else if (responseData?.error === Message.USER_ALREADY_EXISTS) {
        setError("root", { message: Message.USER_ALREADY_EXISTS });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`${joseFont} fs-400`}>SignUp</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(submit)}>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="email" className={`${joseFont} fs-400`}>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter Email"
              className={`${
                errors.signupEmail
                  ? "border-red-500 focus-visible:ring-transparent"
                  : ""
              } ${joseFont} fs-400`}
              {...register("signupEmail")}
            />
            {errors.signupEmail != null && (
              <small
                className={`${joseFont} fs-300 error-message block text-red-600 mt-2`}
              >
                {errors.signupEmail.message}
              </small>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password" className={`${joseFont} fs-400`}>
              New password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter Password"
              className={`${
                errors.signupPassword
                  ? "border-red-500 focus-visible:ring-transparent"
                  : ""
              } ${joseFont} fs-400`}
              {...register("signupPassword")}
            />
          </div>
          {errors.signupPassword != null && (
            <small
              className={`${joseFont} fs-300 error-message block text-red-600 mt-2`}
            >
              {errors.signupPassword.message}
            </small>
          )}
          {errors.root != null && (
            <small
              className={`${joseFont} fs-300 error-message text-white mt-3 borderborder-red-600 text-center 
              px-4 py-2 rounded bg-red-400 flex justify-between content-center`}
            >
              {errors.root.message}
              <FaTimes
                onClick={() => {
                  reset({ signupEmail: "" });
                }}
                className="mt-1"
              />
            </small>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`${joseFont} fs-400 w-[350px]`}
          >
            {isSubmitting ? "Loading..." : "Sign Up"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
