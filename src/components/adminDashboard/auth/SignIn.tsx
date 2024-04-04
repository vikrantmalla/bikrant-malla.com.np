"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { LogInSubmitForm } from "@/types/form";
import { setShowForgetPasswordModal } from "@/redux/feature/appSlice";
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
import { joseFont } from "@/helpers/lib/font";
import { signInSchema } from "@/helpers/schemas";
import { Message } from "@/types/enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";

const SignIn = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      loginEmail: "",
      loginPassword: "",
    },
    resolver: zodResolver(signInSchema),
  });
  const submit = async (data: LogInSubmitForm) => {
    const { loginEmail, loginPassword } = data;
    console.log(loginEmail, loginPassword)
    const email = loginEmail;
    const password = loginPassword;
    signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    toast.success(Message.LOGIN_SUCCESSFUL)
  };

  const handleClick = () => {
    dispatch(setShowForgetPasswordModal(true));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className={`${joseFont} fs-400`}>Sign In</CardTitle>
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
                className={`${joseFont} fs-400`}
                {...register("loginEmail")}
              />
              {errors.loginEmail != null && (
                <small
                  className={`${joseFont} fs-300 error-message block text-red-600 mt-2`}
                >
                  {errors.loginEmail.message}
                </small>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className={`${joseFont} fs-400`}>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter Password"
                className={`${joseFont} fs-400`}
                {...register("loginPassword")}
              />
              {errors.loginPassword != null && (
                <small
                  className={`${joseFont} fs-300 error-message block text-red-600 mt-2`}
                >
                  {errors.loginPassword.message}
                </small>
              )}
            </div>
            <Button
              type="button"
              onClick={() => handleClick()}
              className={`${joseFont} fs-400 bg-transparent border-none text-black w-[350px] shadow-none hover:bg-transparent`}
            >
              Forget Password
            </Button>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`${joseFont} fs-400 w-[350px]`}
            >
              {isSubmitting ? "Loading..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
};

export default SignIn;
