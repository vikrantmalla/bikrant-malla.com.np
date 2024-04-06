"use client";
import React from "react";
import { useRouter } from "next/navigation";
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

const ResetPassword = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/signin");
  };
  return (
    <Card>
      <CardHeader>
        <button onClick={() => handleClick()}>Back</button>
        <CardTitle className={`${joseFont} fs-400`}>Forget Password</CardTitle>
      </CardHeader>
      <form>
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
            />
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
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className={`${joseFont} fs-400 w-[350px]`}>
            Reset Password
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ResetPassword;
