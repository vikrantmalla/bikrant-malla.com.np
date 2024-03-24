"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SignUpSubmitForm } from "@/types/form";
import { loginUser } from "@/helpers/login";
// import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import baseUrl from "@/helpers/lib/baseUrl";
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

const SignUp = ({ config }: ConfigData) => {
  const showForgetPasswordModal = useSelector(
    (state: RootState) => state.app.showForgetPasswordModal
  );

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
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      signupEmail: "",
      signupPassword: "",
      signupConfirmPassword: "",
    },
  });
  // const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [submitError, setSubmitError] = useState<string>("");

  const submit = async (formData: SignUpSubmitForm) => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/signup`, {
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
        const loginRes = await loginUser({
          email: formData.signupEmail,
          password: formData.signupPassword,
        });

        if (loginRes && !loginRes.ok) {
          setSubmitError(loginRes.error || "");
        } else {
          // router.push("/");
        }
        reset();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorMsg = error.message;
        setSubmitError(errorMsg);
      }
    }
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return "Please enter your password";
    }
    if (value.length < 4) {
      return "Password must be at least 4 characters long";
    }
  };

  const validateConfirmPassword = (value: string) => {
    const password = watch("signupPassword");
    if (!value) {
      return "Please enter your confirm password";
    }
    if (value !== password) {
      return "Passwords do not match";
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
              {...register("signupEmail", {
                required: "Please enter your email",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Please enter a valid email",
                },
              })}
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
              className={`${joseFont} fs-400`}
              {...register("signupPassword", {
                validate: validatePassword,
              })}
            />
          </div>
          {errors.signupPassword != null && (
            <small
              className={`${joseFont} fs-300 error-message block text-red-600 mt-2`}
            >
              {errors.signupPassword.message}
            </small>
          )}
          <div className="space-y-1">
            <Label htmlFor="confirm-password" className={`${joseFont} fs-400`}>
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm Password"
              className={`${joseFont} fs-400`}
              {...register("signupConfirmPassword", {
                validate: validateConfirmPassword,
              })}
            />
          </div>
          {errors.signupConfirmPassword != null && (
            <small
              className={`${joseFont} fs-300 error-message block text-red-600 mt-2`}
            >
              {errors.signupConfirmPassword.message}
            </small>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`${joseFont} fs-400 w-[350px]`}
          >
            Sign Up
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
