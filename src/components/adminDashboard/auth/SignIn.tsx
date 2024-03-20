"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { LogInSubmitForm } from "@/types/form";
import { signIn } from "next-auth/react";
import ResetPassword from "./ResetPassword";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setShowModal } from "@/redux/feature/appSlice";
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

interface Props {
  showForgetPasswordModal: boolean;
  setShowForgetPasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      loginEmail: "",
      loginPassword: "",
    },
  });
  const submit = (data: LogInSubmitForm) => {
    const { loginEmail, loginPassword } = data;
    const email = loginEmail;
    const password = loginPassword;
    signIn("credentials", {
      email,
      password,
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>SignIn</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(submit)}>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Email"
                {...register("loginEmail", {
                  required: "Please enter your email",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Please enter a valid email",
                  },
                })}
              />
              {errors.loginEmail != null && (
                <small className="error-message block text-red-600 mt-2">
                  {errors.loginEmail.message}
                </small>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter Password"
                {...register("loginPassword", {
                  required: "Please enter your password",
                })}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
};

export default SignIn;
