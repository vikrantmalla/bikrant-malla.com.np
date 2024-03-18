"use client"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { LogInSubmitForm } from "@/types/form";
import { signIn } from "next-auth/react";
import GoogleButton from "react-google-button";
import ResetPassword from "./ResetPassword";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setShowModal } from "@/redux/feature/appSlice";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Props {
  showForgetPasswordModal: boolean;
  setShowForgetPasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogIn = ({
  showForgetPasswordModal,
  setShowForgetPasswordModal,
}: Props) => {
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
  const dispatch = useDispatch<AppDispatch>();
  const submit = (data: LogInSubmitForm) => {
    const { loginEmail, loginPassword } = data;
    const email = loginEmail;
    const password = loginPassword;
    signIn("credentials", {
      email,
      password,
    });
    toast('Login is successful. 🎉', {
      toastId: 1
    })
    dispatch(setShowModal(false));
  };

  return showForgetPasswordModal === false ? (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Enter Password"
            {...register("loginPassword", {
              required: "Please enter your password",
            })}
          />
          {errors.loginPassword != null && (
            <small className="error-message block text-red-600 mt-2 mx-0">
              {errors.loginPassword.message}
            </small>
          )}
        </div>
        <div className="my-auto">
          <p
            className="mb-4 text-center font-bold text-sm text-blue-500 hover:text-blue-800"
            onClick={() => setShowForgetPasswordModal(true)}
          >
            Forgot Password?
          </p>
          <button
            className={`w-full font-bold py-2 px-4 h-[50px] ${
              isSubmitting
                ? "bg-gray-100 text-black border border-black"
                : "bg-blue-500 hover:bg-blue-700 text-white focus:outline-none focus:shadow-outline"
            }`}
            type="submit"
            disabled={isSubmitting}
          >
            Log In
          </button>
          <GoogleButton
            onClick={() => signIn("google")}
            style={{ width: "100%" }}
            className="mt-3"
          />
        </div>
      </form>
    </>
  ) : (
    <ResetPassword />
  );
};

export default LogIn;
